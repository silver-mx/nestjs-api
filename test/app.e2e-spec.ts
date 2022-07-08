import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from 'src/app.module';
import { DbService } from 'src/db/db.service';
import { AuthDto } from 'src/auth/dto';
import { EditUserDto } from 'src/user/dto/edit-user-dto';
import { CreateBookmarkDto } from 'src/bookmark/dto/create-bookmark-dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let dbService: DbService;
  const port = 3335;
  let authDto: AuthDto = {
    email: null,
    password: 'password',
  };
  let jwtToken;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );
    await app.listen(port);
    await app.init();
    dbService = app.get(DbService);
    await dbService.cleanDb();
    pactum.request.setBaseUrl(`http://localhost:${port}/`);

  });

  afterAll(() => {
    app.close();
  });

  async function signup(dto: AuthDto) {
    return pactum
      .spec()
      .post('auth/signup')
      .withBody(dto)
      .expectStatus(HttpStatus.CREATED);
  }

  function login(dto: AuthDto) {
    return pactum
      .spec()
      .post('auth/login')
      .withBody(dto)
      .expectStatus(HttpStatus.OK);
  }

  async function signupAndloginAndExtractJwtToken() {
    authDto.email = new Date().getTime() + '@gmail.com';
    await signup(authDto);
    jwtToken = await login(authDto).returns('access_token');
  }

  describe('Authorization', () => {
    describe('Signup', () => {
      it('should signup', () => {
        const dto: AuthDto = {
          email: 'demo2@gmail.com',
          password: 'password',
        };
        return signup(dto);
      });

      it('should throw bad request if email empty', () => {
        return pactum.spec()
          .post('auth/signup')
          .withBody({ password: authDto.password })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });

      it('should throw bad request if password empty', () => {
        return pactum.spec()
          .post('auth/signup')
          .withBody({ email: authDto.email })
          .expectStatus(HttpStatus.BAD_REQUEST);
      });
    });

    describe('Login', () => {
      it('should log in', () => {
        const dto: AuthDto = {
          email: 'demo2@gmail.com',
          password: 'password',
        };
        return login(dto);
      });
    });
  });

  describe('User', () => {

    beforeEach(async () => {
      await signupAndloginAndExtractJwtToken();
    });

    describe('Get current user', () => {
      it('should get the current user', () => {
        return pactum.spec()
          .get('users/me')
          .withHeaders({
            Authorization: `Bearer ${jwtToken}`
          })
          .expectStatus(HttpStatus.OK);
      });
    });

    describe('Edit current user', () => {
      const editUserDto: EditUserDto = {
        email: 'name.last@gmail.com',
        firstname: 'Name',
        lastname: 'Last'
      };

      it('should edit the current user', () => {
        return pactum.spec()
          .patch('users')
          .withHeaders({
            Authorization: `Bearer ${jwtToken}`
          })
          .withBody(editUserDto)
          .expectStatus(HttpStatus.OK)
          .expectJsonLike(editUserDto);
      });
    });
  });

  describe('Bookmark', () => {

    beforeEach(async () => {
      await signupAndloginAndExtractJwtToken();
    });

    describe('Get bookmarks', () => {
      it('should get all bookmarks', () => {
        return pactum.spec()
          .get('bookmarks')
          .withHeaders({
            Authorization: `Bearer ${jwtToken}`
          })
          .expectStatus(HttpStatus.OK)
          .expectJson([]);
      });
    });

    async function createBookmark(dto: CreateBookmarkDto) {
      return pactum.spec()
        .post('bookmarks')
        .withHeaders({
          Authorization: `Bearer ${jwtToken}`
        })
        .withBody(dto)
        .expectStatus(HttpStatus.CREATED)
        .expectJsonLike(dto)
        .stores('bookmarkId', 'id');
    }

    describe('Create bookmarks', () => {
      it('should create a bookmark', () => {
        const dto = {
          title: 'TITLE',
          description: 'This is a desc',
          link: 'https://fake.link.com'
        };
        return createBookmark(dto);
      });
    });

    describe('Get bookmark by id', () => {
      it('should get a bookmark by id', async () => {
        const dto = createBookmarkDto();
        await createBookmark(dto);
        return pactum.spec()
          .get('bookmarks/$S{bookmarkId}')
          .withHeaders({
            Authorization: `Bearer ${jwtToken}`
          })
          .expectStatus(HttpStatus.OK)
          .expectJsonLike(dto);
      });
    });

    function createBookmarkDto(): CreateBookmarkDto {
      return {
        title: new Date().getTime().toString(),
        description: 'This is a desc',
        link: 'https://fake.link.com'
      };
    }

    describe('Edit bookmark', () => {
      it('should edit the title of a bookmark', async () => {
        const dto = createBookmarkDto();
        await createBookmark(dto);
        return pactum.spec()
          .patch('bookmarks/$S{bookmarkId}')
          .withHeaders({
            Authorization: `Bearer ${jwtToken}`
          })
          .withBody({
            title: 'This is a new title'
          })
          .expectStatus(HttpStatus.OK)
          .expectJsonLike({ title: 'This is a new title' });
      });
    });

    describe('Delete bookmark', () => {
      it('should delete a bookmark by id', async () => {
        const dto = createBookmarkDto();
        await createBookmark(dto);
        return pactum.spec()
          .delete('bookmarks/$S{bookmarkId}')
          .withHeaders({
            Authorization: `Bearer ${jwtToken}`
          })
          .expectStatus(HttpStatus.NO_CONTENT);
      });
    });
  });
});

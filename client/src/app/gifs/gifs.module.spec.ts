import { GifsModule } from './gifs.module';

describe('GifsModule', () => {
  let gifsModule: GifsModule;

  beforeEach(() => {
    gifsModule = new GifsModule();
  });

  it('should create an instance', () => {
    expect(gifsModule).toBeTruthy();
  });
});

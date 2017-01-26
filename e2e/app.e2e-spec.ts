import { NewyocPage } from './app.po';

describe('newyoc App', function() {
  let page: NewyocPage;

  beforeEach(() => {
    page = new NewyocPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

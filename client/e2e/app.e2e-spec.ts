import { YocClientPage } from './app.po';

describe('yoc-client App', function() {
  let page: YocClientPage;

  beforeEach(() => {
    page = new YocClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

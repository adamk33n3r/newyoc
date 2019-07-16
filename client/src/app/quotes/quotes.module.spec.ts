import { QuotesModule } from './quotes.module';

describe('QuotesModule', () => {
  let quotesModule: QuotesModule;

  beforeEach(() => {
    quotesModule = new QuotesModule();
  });

  it('should create an instance', () => {
    expect(quotesModule).toBeTruthy();
  });
});

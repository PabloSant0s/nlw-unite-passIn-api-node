import { Slug } from './slug'

describe('value Object Slug', () => {
  it('should create a slug from text', () => {
    const slug = Slug.createFromText('São Paulo')
    expect(slug.toValue()).toBe('sao-paulo')
  })
})

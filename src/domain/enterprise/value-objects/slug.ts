export class Slug {
  private value: string

  constructor(value: string) {
    this.value = value
  }

  static createFromText(text: string): Slug {
    const slug = text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove all non-word chars
      .replace(/\s+/g, '-')

    return new Slug(slug)
  }

  public toValue(): string {
    return this.value
  }
}

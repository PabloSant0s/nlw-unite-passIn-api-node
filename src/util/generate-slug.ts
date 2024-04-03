export function generateSlug(text: string){
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove all non-word chars
    .replace(/\s+/g, '-') // Replace spaces with -
}
/**
 * Helper para normalizar caminhos de imagens do banco de dados
 * Converte caminhos antigos para funcionar no React
 */

export const getImagePath = (imagemPath) => {
  if (!imagemPath) return null;
  
  // Se já é uma URL completa, retorna como está
  if (imagemPath.startsWith('http://') || imagemPath.startsWith('https://')) {
    return imagemPath;
  }
  
  // Remove "./" do início se existir
  let cleanPath = imagemPath.replace(/^\.\//, '');
  
  // Remove "../" do início se existir
  cleanPath = cleanPath.replace(/^\.\.\//, '');
  
  // Se não começar com /, adiciona
  if (!cleanPath.startsWith('/')) {
    cleanPath = '/' + cleanPath;
  }
  
  return cleanPath;
};

/**
 * Verifica se uma imagem existe e retorna um fallback se necessário
 */
export const getImageWithFallback = (imagemPath, fallbackPath = '/placeholder.gif') => {
  const path = getImagePath(imagemPath);
  return path || fallbackPath;
};

/**
 * Para debug: loga o caminho da imagem
 */
export const debugImagePath = (imagemPath) => {
  console.log('Original path:', imagemPath);
  console.log('Normalized path:', getImagePath(imagemPath));
};

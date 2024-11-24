export const LOCAL_STORAGE_KEYS = {
  FAVORITES: 'real_estate_favorites',
  WISHLIST: 'real_estate_wishlist',
};

export const getLocalFavorites = (): string[] => {
  try {
    const favorites = localStorage.getItem(LOCAL_STORAGE_KEYS.FAVORITES);
    return favorites ? JSON.parse(favorites) : [];
  } catch {
    return [];
  }
};

export const getLocalWishlist = (): string[] => {
  try {
    const wishlist = localStorage.getItem(LOCAL_STORAGE_KEYS.WISHLIST);
    return wishlist ? JSON.parse(wishlist) : [];
  } catch {
    return [];
  }
};

export const toggleLocalFavorite = (propertyId: string): string[] => {
  const favorites = getLocalFavorites();
  const index = favorites.indexOf(propertyId);
  
  if (index === -1) {
    favorites.push(propertyId);
  } else {
    favorites.splice(index, 1);
  }
  
  localStorage.setItem(LOCAL_STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  return favorites;
};

export const toggleLocalWishlist = (propertyId: string): string[] => {
  const wishlist = getLocalWishlist();
  const index = wishlist.indexOf(propertyId);
  
  if (index === -1) {
    wishlist.push(propertyId);
  } else {
    wishlist.splice(index, 1);
  }
  
  localStorage.setItem(LOCAL_STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
  return wishlist;
};

export const clearLocalStorage = (): void => {
  localStorage.removeItem(LOCAL_STORAGE_KEYS.FAVORITES);
  localStorage.removeItem(LOCAL_STORAGE_KEYS.WISHLIST);
};
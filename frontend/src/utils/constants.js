export const TMDB_BASE = import.meta.env.VITE_TMDB_BASE || 'https://api.themoviedb.org/3';
export const IMG_BASE  = import.meta.env.VITE_IMG_BASE  || 'https://image.tmdb.org/t/p';

export const IMAGE_SIZES = {
  poster:   { sm: '/w200', md: '/w342', lg: '/w500', xl: '/w780' },
  backdrop: { sm: '/w300', md: '/w780', lg: '/w1280', xl: '/original' },
  profile:  { sm: '/w45',  md: '/w185', lg: '/h632' },
};

export const PLACEHOLDER_POSTER   = 'https://via.placeholder.com/300x450/1a1e2a/e8b64a?text=No+Image';
export const PLACEHOLDER_BACKDROP = 'https://via.placeholder.com/1280x720/08090d/e8b64a?text=No+Image';
export const PLACEHOLDER_AVATAR   = 'https://via.placeholder.com/200x200/1a1e2a/8892a4?text=👤';

export const GENRES_MOVIE = [
  { id: 28,    name: 'Action'      }, { id: 12,    name: 'Adventure'  },
  { id: 16,    name: 'Animation'   }, { id: 35,    name: 'Comedy'     },
  { id: 80,    name: 'Crime'       }, { id: 99,    name: 'Documentary'},
  { id: 18,    name: 'Drama'       }, { id: 10751, name: 'Family'     },
  { id: 14,    name: 'Fantasy'     }, { id: 36,    name: 'History'    },
  { id: 27,    name: 'Horror'      }, { id: 9648,  name: 'Mystery'    },
  { id: 10749, name: 'Romance'     }, { id: 878,   name: 'Sci-Fi'     },
  { id: 53,    name: 'Thriller'    }, { id: 10752, name: 'War'        },
  { id: 37,    name: 'Western'     },
];

export const GENRES_TV = [
  { id: 10759, name: 'Action & Adventure' }, { id: 16,    name: 'Animation'        },
  { id: 35,    name: 'Comedy'             }, { id: 80,    name: 'Crime'             },
  { id: 99,    name: 'Documentary'        }, { id: 18,    name: 'Drama'             },
  { id: 10751, name: 'Family'             }, { id: 10762, name: 'Kids'              },
  { id: 9648,  name: 'Mystery'            }, { id: 10765, name: 'Sci-Fi & Fantasy'  },
  { id: 10768, name: 'War & Politics'     }, { id: 37,    name: 'Western'           },
];

export const NAV_LINKS = [
  { label: 'Home',      path: '/'          },
  { label: 'Movies',    path: '/movies'    },
  { label: 'TV Shows',  path: '/tv'        },
  { label: 'Favorites', path: '/favorites' },
  { label: 'History',   path: '/history'   },
];

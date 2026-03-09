// src/pages/Home/Home.jsx
import React, { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import HeroBanner from '../../components/HeroBanner/HeroBanner';
import MovieCarousel from '../../components/MovieCarousel/MovieCarousel';
import Footer from '../../components/Footer/Footer';
import { PersonCard } from '../MovieDetails/MovieDetails';
import tmdbAPI from '../../api/tmdb';
import { getYouTubeTrailer, getTitle } from '../../utils/helpers';
import './Home.css';

export default function Home() {
  const { setTrailer } = useOutletContext() || {};
  const [trending,    setTrending]    = useState(null);
  const [popular,     setPopular]     = useState(null);
  const [topRated,    setTopRated]    = useState(null);
  const [nowPlaying,  setNowPlaying]  = useState(null);
  const [tvShows,     setTvShows]     = useState(null);
  const [people,      setPeople]      = useState(null);

  useEffect(() => {
    tmdbAPI.getTrending('movie').then((d)  => setTrending(d?.results  || []));
    tmdbAPI.getPopularMovies().then((d)    => setPopular(d?.results    || []));
    tmdbAPI.getTopRatedMovies().then((d)   => setTopRated(d?.results   || []));
    tmdbAPI.getNowPlaying().then((d)       => setNowPlaying(d?.results || []));
    tmdbAPI.getPopularTV().then((d)        => setTvShows(d?.results    || []));
    tmdbAPI.getPopularPeople().then((d)    => setPeople(d?.results     || []));
  }, []);

  const handlePlayTrailer = async (movie) => {
    try {
      const details = await tmdbAPI.getMovieDetails(movie.id);
      const trailer = getYouTubeTrailer(details.videos);
      setTrailer?.({ key: trailer?.key || null, title: getTitle(movie) });
    } catch {
      setTrailer?.({ key: null, title: getTitle(movie) });
    }
  };

  return (
    <div className="home-page">
      <HeroBanner movies={trending || []} onPlayTrailer={handlePlayTrailer} />

      <div className="home-page__sections">
        <MovieCarousel title="🔥 Trending Now"    items={trending}   loading={!trending}   />
        <MovieCarousel title="🎬 Now Playing"     items={nowPlaying} loading={!nowPlaying} />
        <MovieCarousel title="⭐ Popular Movies"  items={popular}    loading={!popular}    />
        <MovieCarousel title="🏆 Top Rated"       items={topRated}   loading={!topRated}   />
        <MovieCarousel title="📺 Popular TV"      items={tvShows}    loading={!tvShows}    type="tv" />
        <MovieCarousel
          title="👥 Popular People"
          items={people}
          loading={!people}
          renderItem={(p) => <PersonCard key={p.id} person={p} />}
        />
      </div>

      <Footer />
    </div>
  );
}

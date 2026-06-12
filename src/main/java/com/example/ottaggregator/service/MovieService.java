package com.example.ottaggregator.service;

import com.example.ottaggregator.entity.MovieCache;
import com.example.ottaggregator.repository.MovieCacheRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class MovieService {

    @Value("${app.tmdb.api-key}")
    private String apiKey;

    @Value("${app.tmdb.base-url}")
    private String baseUrl;

    @Autowired
    private MovieCacheRepository movieCacheRepository;

    private final RestTemplate restTemplate = new RestTemplate();

    // In-memory detailed Mock Database for the "mock" mode
    private static final List<Map<String, Object>> MOCK_MOVIES = new ArrayList<>();

    static {
        // Initialize rich mock database
        // Movie 1: In Theater
        MOCK_MOVIES.add(createMockMovie(
                101L, "Dune: Part Two", "2024-03-01", 8.4,
                "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop",
                "Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.",
                "THEATER", "English", Arrays.asList("Science Fiction", "Adventure"),
                Arrays.asList("Timothée Chalamet", "Zendaya", "Rebecca Ferguson", "Javier Bardem"),
                Arrays.asList(
                        createProvider("HBO Max", "https://img.icons8.com/color/48/hbo-max.png"),
                        createProvider("Apple TV", "https://img.icons8.com/color/48/apple-tv.png")
                )
        ));

        // Movie 2: In Theater
        MOCK_MOVIES.add(createMockMovie(
                102L, "Oppenheimer", "2023-07-21", 8.9,
                "https://images.unsplash.com/photo-1440404653325-ab127d49abc1?w=500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&auto=format&fit=crop",
                "The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.",
                "THEATER", "English", Arrays.asList("Drama", "History", "Biography"),
                Arrays.asList("Cillian Murphy", "Emily Blunt", "Matt Damon", "Robert Downey Jr."),
                Arrays.asList(
                        createProvider("Amazon Prime", "https://img.icons8.com/color/48/amazon-prime-video.png"),
                        createProvider("Apple TV", "https://img.icons8.com/color/48/apple-tv.png")
                )
        ));

        // Movie 3: In Theater (Indian/Regional)
        MOCK_MOVIES.add(createMockMovie(
                103L, "Kalki 2898 AD", "2024-06-27", 8.2,
                "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop",
                "A modern avatar of Vishnu, a Hindu god, is believed to have descended to earth to protect the world from evil forces.",
                "THEATER", "Telugu", Arrays.asList("Action", "Sci-Fi", "Fantasy"),
                Arrays.asList("Prabhas", "Amitabh Bachchan", "Kamal Haasan", "Deepika Padukone"),
                Arrays.asList(
                        createProvider("Netflix", "https://img.icons8.com/color/48/netflix--v1.png"),
                        createProvider("Amazon Prime", "https://img.icons8.com/color/48/amazon-prime-video.png")
                )
        ));

        // Movie 4: Upcoming on OTT (Netflix)
        MOCK_MOVIES.add(createMockMovie(
                104L, "Squid Game: Season 2", "2026-06-15", 8.7,
                "https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1200&auto=format&fit=crop",
                "Three years after winning Squid Game, Player 456 remains determined to find the people behind the game and put an end to their vicious sport.",
                "OTT", "Korean", Arrays.asList("Thriller", "Drama", "Action"),
                Arrays.asList("Lee Jung-jae", "Lee Byung-hun", "Wi Ha-jun", "Gong Yoo"),
                List.of(createProvider("Netflix", "https://img.icons8.com/color/48/netflix--v1.png"))
        ));

        // Movie 5: Upcoming on OTT (Prime Video)
        MOCK_MOVIES.add(createMockMovie(
                105L, "The Boys: Season 4", "2024-06-13", 8.5,
                "https://images.unsplash.com/photo-1569074187119-c87815b476da?w=500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1531259683007-016a7b628fc3?w=1200&auto=format&fit=crop",
                "The world is on the brink. Victoria Neuman is closer than ever to the Oval Office and under the muscled thumb of Homelander, who is consolidating his power.",
                "OTT", "English", Arrays.asList("Action", "Sci-Fi", "Comedy"),
                Arrays.asList("Karl Urban", "Jack Quaid", "Antony Starr", "Erin Moriarty"),
                List.of(createProvider("Amazon Prime", "https://img.icons8.com/color/48/amazon-prime-video.png"))
        ));

        // Movie 6: Upcoming on OTT (Disney+)
        MOCK_MOVIES.add(createMockMovie(
                106L, "Deadpool & Wolverine", "2026-07-26", 8.8,
                "https://images.unsplash.com/photo-1608889175123-8ec330b86f84?w=500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=1200&auto=format&fit=crop",
                "A listless Wade Wilson toils in civilian life. His days as the morally flexible mercenary, Deadpool, behind him. When his homeworld faces an existential threat, Wade must reluctantly suit-up again with an even more reluctant Wolverine.",
                "OTT", "English", Arrays.asList("Action", "Comedy", "Sci-Fi"),
                Arrays.asList("Ryan Reynolds", "Hugh Jackman", "Emma Corrin", "Morena Baccarin"),
                List.of(createProvider("Disney+ Hotstar", "https://img.icons8.com/color/48/disney-plus.png"))
        ));

        // Movie 7: In Theater
        MOCK_MOVIES.add(createMockMovie(
                107L, "Bad Boys: Ride or Die", "2024-06-07", 7.6,
                "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&auto=format&fit=crop",
                "This summer, the world's favorite Bad Boys are back with their iconic mix of edge-of-your-seat action and outrageous comedy but this time with a twist: Miami's finest are now on the run.",
                "THEATER", "English", Arrays.asList("Action", "Comedy", "Crime"),
                Arrays.asList("Will Smith", "Martin Lawrence", "Vanessa Hudgens", "Alexander Ludwig"),
                Arrays.asList(
                        createProvider("Apple TV", "https://img.icons8.com/color/48/apple-tv.png"),
                        createProvider("Amazon Prime", "https://img.icons8.com/color/48/amazon-prime-video.png")
                )
        ));

        // Movie 8: In Theater (Hindi/Regional)
        MOCK_MOVIES.add(createMockMovie(
                108L, "Chandu Champion", "2024-06-14", 8.0,
                "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1505250469613-27bac681b33b?w=1200&auto=format&fit=crop",
                "The extraordinary real-life story of Murlikant Petkar, a soldier who was shot during the war but survived and went on to become India's first Paralympic gold medalist.",
                "THEATER", "Hindi", Arrays.asList("Drama", "Biography", "Sport"),
                Arrays.asList("Kartik Aaryan", "Vijay Raaz", "Bhuvan Arora", "Yashpal Sharma"),
                List.of(createProvider("Amazon Prime", "https://img.icons8.com/color/48/amazon-prime-video.png"))
        ));

        // Movie 9: Upcoming on OTT (JioCinema)
        MOCK_MOVIES.add(createMockMovie(
                109L, "House of the Dragon: Season 2", "2026-06-17", 8.6,
                "https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?w=500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1200&auto=format&fit=crop",
                "The Targaryen civil war begins. Following the death of King Viserys, Westeros splits between the Greens (supporters of Aegon) and the Blacks (supporters of Rhaenyra).",
                "OTT", "English", Arrays.asList("Action", "Drama", "Fantasy"),
                Arrays.asList("Emma D'Arcy", "Matt Smith", "Olivia Cooke", "Rhys Ifans"),
                List.of(createProvider("JioCinema", "https://img.icons8.com/color/48/playstation.png")) // Mock icon
        ));

        // Movie 10: In Theater
        MOCK_MOVIES.add(createMockMovie(
                110L, "Furiosa: A Mad Max Saga", "2024-05-24", 7.8,
                "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=1200&auto=format&fit=crop",
                "As the world fell, young Furiosa is snatched from the Green Place of Many Mothers and falls into the hands of a great Biker Horde led by the Warlord Dementus.",
                "THEATER", "English", Arrays.asList("Action", "Adventure", "Sci-Fi"),
                Arrays.asList("Anya Taylor-Joy", "Chris Hemsworth", "Tom Burke", "Lachy Hulme"),
                Arrays.asList(
                        createProvider("Apple TV", "https://img.icons8.com/color/48/apple-tv.png"),
                        createProvider("Amazon Prime", "https://img.icons8.com/color/48/amazon-prime-video.png")
                )
        ));

        // Movie 11: Upcoming on OTT (Netflix/Disney)
        MOCK_MOVIES.add(createMockMovie(
                111L, "Spider-Man: Beyond the Spider-Verse", "2026-12-18", 9.1,
                "https://images.unsplash.com/photo-1635805737707-575885ab0820?w=500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop",
                "Miles Morales team up once again to save the multiverse from a catastrophic threat, following the cliffhanger event of Across the Spider-Verse.",
                "OTT", "English", Arrays.asList("Animation", "Action", "Adventure", "Sci-Fi"),
                Arrays.asList("Shameik Moore", "Hailee Steinfeld", "Oscar Isaac", "Jake Johnson"),
                Arrays.asList(
                        createProvider("Netflix", "https://img.icons8.com/color/48/netflix--v1.png"),
                        createProvider("Disney+ Hotstar", "https://img.icons8.com/color/48/disney-plus.png")
                )
        ));

        // Movie 12: In Theater
        MOCK_MOVIES.add(createMockMovie(
                112L, "Inception", "2010-07-16", 8.8,
                "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?w=1200&auto=format&fit=crop",
                "A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.",
                "THEATER", "English", Arrays.asList("Action", "Sci-Fi", "Thriller"),
                Arrays.asList("Leonardo DiCaprio", "Joseph Gordon-Levitt", "Elliot Page", "Tom Hardy"),
                Arrays.asList(
                        createProvider("Netflix", "https://img.icons8.com/color/48/netflix--v1.png"),
                        createProvider("Apple TV", "https://img.icons8.com/color/48/apple-tv.png")
                )
        ));

        // Movie 13: In Theater
        MOCK_MOVIES.add(createMockMovie(
                113L, "Interstellar", "2014-11-07", 8.7,
                "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1444703686981-a3abbc4d4fe3?w=1200&auto=format&fit=crop",
                "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival on a dying Earth.",
                "THEATER", "English", Arrays.asList("Adventure", "Drama", "Sci-Fi"),
                Arrays.asList("Matthew McConaughey", "Anne Hathaway", "Jessica Chastain", "Michael Caine"),
                Arrays.asList(
                        createProvider("Amazon Prime", "https://img.icons8.com/color/48/amazon-prime-video.png"),
                        createProvider("Apple TV", "https://img.icons8.com/color/48/apple-tv.png")
                )
        ));

        // Movie 14: In Theater (Telugu/Hindi)
        MOCK_MOVIES.add(createMockMovie(
                114L, "Pushpa 2: The Rule", "2024-12-05", 8.3,
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1599733589046-9b8308b5b50d?w=1200&auto=format&fit=crop",
                "The clash continues between Pushpa Raj and SP Bhanwar Singh Shekhawat in this highly anticipated sequel mapping the red sandalwood smuggling empire.",
                "THEATER", "Telugu", Arrays.asList("Action", "Drama", "Crime"),
                Arrays.asList("Allu Arjun", "Fahadh Faasil", "Rashmika Mandanna", "Jagadeesh Prathap"),
                List.of(
                        createProvider("Netflix", "https://img.icons8.com/color/48/netflix--v1.png")
                )
        ));

        // Movie 15: Upcoming on OTT (Crunchyroll)
        MOCK_MOVIES.add(createMockMovie(
                115L, "Attack on Titan: Final Chapters", "2023-11-05", 9.0,
                "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop",
                "The fate of the world hangs in the balance as Eren Jaeger unleashes the ultimate power of the Titans. Can his former allies stop him before everything is crushed?",
                "OTT", "Japanese", Arrays.asList("Animation", "Action", "Fantasy"),
                Arrays.asList("Yuki Kaji", "Yui Ishikawa", "Marina Inoue", "Hiroshi Kamiya"),
                List.of(
                        createProvider("Amazon Prime", "https://img.icons8.com/color/48/amazon-prime-video.png") // Crunchyroll mock
                )
        ));

        // Movie 16: In Theater (Tamil)
        MOCK_MOVIES.add(createMockMovie(
                116L, "Leo", "2023-10-19", 7.9,
                "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&auto=format&fit=crop",
                "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=1200&auto=format&fit=crop",
                "A gentle cafe owner becomes the target of a drug cartel who claim he is the estranged son of a powerful gangster kingpin.",
                "THEATER", "Tamil", Arrays.asList("Action", "Thriller", "Crime"),
                Arrays.asList("Thalapathy Vijay", "Sanjay Dutt", "Arjun Sarja", "Trisha Krishnan"),
                List.of(
                        createProvider("Netflix", "https://img.icons8.com/color/48/netflix--v1.png")
                )
        ));
    }

    private static Map<String, Object> createMockMovie(
            Long id, String title, String releaseDate, Double voteAverage,
            String posterPath, String backdropPath, String overview,
            String sourceType, String language, List<String> genres,
            List<String> cast, List<Map<String, String>> watchProviders) {

        Map<String, Object> movie = new HashMap<>();
        movie.put("id", id);
        movie.put("title", title);
        movie.put("releaseDate", releaseDate);
        movie.put("voteAverage", voteAverage);
        movie.put("posterPath", posterPath);
        movie.put("backdropPath", backdropPath);
        movie.put("overview", overview);
        movie.put("sourceType", sourceType);
        movie.put("language", language);
        movie.put("genres", genres);
        movie.put("cast", cast);
        movie.put("watchProviders", watchProviders);
        return movie;
    }

    private static Map<String, String> createProvider(String name, String logoUrl) {
        Map<String, String> provider = new HashMap<>();
        provider.put("providerName", name);
        provider.put("logoUrl", logoUrl);
        return provider;
    }

    private boolean isMockMode() {
        return apiKey == null || apiKey.isEmpty() || "mock".equalsIgnoreCase(apiKey);
    }

    public List<Map<String, Object>> getNowPlayingMovies() {
        if (isMockMode()) {
            // Filter categories and cache them
            List<Map<String, Object>> theaterMovies = new ArrayList<>();
            for (Map<String, Object> m : MOCK_MOVIES) {
                if ("THEATER".equals(m.get("sourceType"))) {
                    theaterMovies.add(m);
                    cacheMovie(m);
                }
            }
            return theaterMovies;
        }

        // Live API call: GET /movie/now_playing
        try {
            String url = String.format("%s/movie/now_playing?api_key=%s", baseUrl, apiKey);
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("results")) {
                List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
                results.forEach(m -> {
                    m.put("sourceType", "THEATER");
                    if (m.get("poster_path") != null) {
                        m.put("posterPath", "https://image.tmdb.org/t/p/w500" + m.get("poster_path"));
                    }
                });
                return results;
            }
        } catch (Exception e) {
            // Fallback to mock on TMDB error
        }
        return getNowPlayingMoviesFallback();
    }

    public List<Map<String, Object>> getUpcomingMovies() {
        if (isMockMode()) {
            List<Map<String, Object>> ottMovies = new ArrayList<>();
            for (Map<String, Object> m : MOCK_MOVIES) {
                if ("OTT".equals(m.get("sourceType"))) {
                    ottMovies.add(m);
                    cacheMovie(m);
                }
            }
            return ottMovies;
        }

        // Live API call: GET /movie/upcoming
        try {
            String url = String.format("%s/movie/upcoming?api_key=%s", baseUrl, apiKey);
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("results")) {
                List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
                results.forEach(m -> {
                    m.put("sourceType", "OTT");
                    if (m.get("poster_path") != null) {
                        m.put("posterPath", "https://image.tmdb.org/t/p/w500" + m.get("poster_path"));
                    }
                });
                return results;
            }
        } catch (Exception e) {
            // Fallback
        }
        return getUpcomingMoviesFallback();
    }

    public Map<String, Object> getMovieDetails(Long tmdbId) {
        if (isMockMode() || tmdbId < 200) { // Keep low IDs mapped to mock db
            for (Map<String, Object> m : MOCK_MOVIES) {
                if (Objects.equals(m.get("id"), tmdbId)) {
                    return m;
                }
            }
            throw new RuntimeException("Movie details not found!");
        }

        // Live API call: GET /movie/{id}
        try {
            String url = String.format("%s/movie/%d?api_key=%s&append_to_response=credits,watch/providers", baseUrl, tmdbId, apiKey);
            Map<String, Object> details = restTemplate.getForObject(url, Map.class);
            if (details != null) {
                // Adapt fields
                Map<String, Object> adapted = adaptTmdbDetails(details);
                return adapted;
            }
        } catch (Exception e) {
            // Fallback
        }
        return getMovieDetailsFallback(tmdbId);
    }

    public List<Map<String, Object>> searchMovies(String query) {
        if (query == null || query.trim().isEmpty()) {
            return Collections.emptyList();
        }

        if (isMockMode()) {
            List<Map<String, Object>> matches = new ArrayList<>();
            String lowercaseQuery = query.toLowerCase();
            for (Map<String, Object> m : MOCK_MOVIES) {
                String title = ((String) m.get("title")).toLowerCase();
                String overview = ((String) m.get("overview")).toLowerCase();
                if (title.contains(lowercaseQuery) || overview.contains(lowercaseQuery)) {
                    matches.add(m);
                }
            }
            return matches;
        }

        // Live API call: GET /search/movie
        try {
            String url = String.format("%s/search/movie?api_key=%s&query=%s", baseUrl, apiKey, query);
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("results")) {
                List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("results");
                results.forEach(m -> {
                    if (m.get("poster_path") != null) {
                        m.put("posterPath", "https://image.tmdb.org/t/p/w500" + m.get("poster_path"));
                    }
                });
                return results;
            }
        } catch (Exception e) {
            // Fallback
        }
        return Collections.emptyList();
    }

    public List<Map<String, String>> getWatchProviders(Long tmdbId) {
        if (isMockMode() || tmdbId < 200) {
            for (Map<String, Object> m : MOCK_MOVIES) {
                if (Objects.equals(m.get("id"), tmdbId)) {
                    return (List<Map<String, String>>) m.get("watchProviders");
                }
            }
            return Collections.emptyList();
        }

        // Live API call
        try {
            String url = String.format("%s/movie/%d/watch/providers?api_key=%s", baseUrl, tmdbId, apiKey);
            Map<String, Object> response = restTemplate.getForObject(url, Map.class);
            if (response != null && response.containsKey("results")) {
                Map<String, Object> results = (Map<String, Object>) response.get("results");
                // Check US or IN regions
                Map<String, Object> regionalData = null;
                if (results.containsKey("IN")) {
                    regionalData = (Map<String, Object>) results.get("IN");
                } else if (results.containsKey("US")) {
                    regionalData = (Map<String, Object>) results.get("US");
                } else if (!results.isEmpty()) {
                    // Fetch first available region
                    String firstRegion = results.keySet().iterator().next();
                    regionalData = (Map<String, Object>) results.get(firstRegion);
                }

                if (regionalData != null && regionalData.containsKey("flatrate")) {
                    List<Map<String, Object>> flatrate = (List<Map<String, Object>>) regionalData.get("flatrate");
                    List<Map<String, String>> providers = new ArrayList<>();
                    for (Map<String, Object> item : flatrate) {
                        Map<String, String> p = new HashMap<>();
                        p.put("providerName", (String) item.get("provider_name"));
                        p.put("logoUrl", "https://image.tmdb.org/t/p/w92" + item.get("logo_path"));
                        providers.add(p);
                    }
                    return providers;
                }
            }
        } catch (Exception e) {
            // Fallback
        }
        return Collections.emptyList();
    }

    // Helper to write to database cache
    private void cacheMovie(Map<String, Object> movieMap) {
        Long tmdbId = (Long) movieMap.get("id");
        if (movieCacheRepository.findByTmdbMovieId(tmdbId).isEmpty()) {
            MovieCache cache = MovieCache.builder()
                    .tmdbMovieId(tmdbId)
                    .title((String) movieMap.get("title"))
                    .releaseDate((String) movieMap.get("releaseDate"))
                    .posterPath((String) movieMap.get("posterPath"))
                    .voteAverage((Double) movieMap.get("voteAverage"))
                    .overview((String) movieMap.get("overview"))
                    .sourceType((String) movieMap.get("sourceType"))
                    .build();
            movieCacheRepository.save(cache);
        }
    }

    private List<Map<String, Object>> getNowPlayingMoviesFallback() {
        List<Map<String, Object>> theaterMovies = new ArrayList<>();
        for (Map<String, Object> m : MOCK_MOVIES) {
            if ("THEATER".equals(m.get("sourceType"))) {
                theaterMovies.add(m);
            }
        }
        return theaterMovies;
    }

    private List<Map<String, Object>> getUpcomingMoviesFallback() {
        List<Map<String, Object>> ottMovies = new ArrayList<>();
        for (Map<String, Object> m : MOCK_MOVIES) {
            if ("OTT".equals(m.get("sourceType"))) {
                ottMovies.add(m);
            }
        }
        return ottMovies;
    }

    private Map<String, Object> getMovieDetailsFallback(Long id) {
        for (Map<String, Object> m : MOCK_MOVIES) {
            if (Objects.equals(m.get("id"), id)) {
                return m;
            }
        }
        return MOCK_MOVIES.get(0);
    }

    private Map<String, Object> adaptTmdbDetails(Map<String, Object> details) {
        Map<String, Object> movie = new HashMap<>();
        movie.put("id", Long.valueOf(details.get("id").toString()));
        movie.put("title", details.get("title"));
        movie.put("releaseDate", details.get("release_date"));
        movie.put("voteAverage", details.get("vote_average"));

        String poster = details.get("poster_path") != null ? "https://image.tmdb.org/t/p/w500" + details.get("poster_path") : null;
        movie.put("posterPath", poster);

        String backdrop = details.get("backdrop_path") != null ? "https://image.tmdb.org/t/p/original" + details.get("backdrop_path") : null;
        movie.put("backdropPath", backdrop);

        movie.put("overview", details.get("overview"));
        movie.put("language", details.get("original_language"));

        // Extract genres
        List<String> genres = new ArrayList<>();
        if (details.containsKey("genres")) {
            List<Map<String, Object>> genreList = (List<Map<String, Object>>) details.get("genres");
            for (Map<String, Object> g : genreList) {
                genres.add((String) g.get("name"));
            }
        }
        movie.put("genres", genres);

        // Extract cast
        List<String> cast = new ArrayList<>();
        if (details.containsKey("credits")) {
            Map<String, Object> credits = (Map<String, Object>) details.get("credits");
            if (credits.containsKey("cast")) {
                List<Map<String, Object>> castList = (List<Map<String, Object>>) credits.get("cast");
                int limit = Math.min(castList.size(), 5);
                for (int i = 0; i < limit; i++) {
                    cast.add((String) castList.get(i).get("name"));
                }
            }
        }
        movie.put("cast", cast);

        // Determine if OTT or THEATER based on release date / status
        String status = (String) details.get("status");
        if ("Released".equalsIgnoreCase(status)) {
            movie.put("sourceType", "THEATER");
        } else {
            movie.put("sourceType", "OTT");
        }

        // Get watch providers from details
        List<Map<String, String>> providers = new ArrayList<>();
        if (details.containsKey("watch/providers")) {
            Map<String, Object> wpData = (Map<String, Object>) details.get("watch/providers");
            if (wpData.containsKey("results")) {
                Map<String, Object> results = (Map<String, Object>) wpData.get("results");
                Map<String, Object> regionalData = null;
                if (results.containsKey("IN")) {
                    regionalData = (Map<String, Object>) results.get("IN");
                } else if (results.containsKey("US")) {
                    regionalData = (Map<String, Object>) results.get("US");
                }

                if (regionalData != null && regionalData.containsKey("flatrate")) {
                    List<Map<String, Object>> flatrate = (List<Map<String, Object>>) regionalData.get("flatrate");
                    for (Map<String, Object> item : flatrate) {
                        Map<String, String> p = new HashMap<>();
                        p.put("providerName", (String) item.get("provider_name"));
                        p.put("logoUrl", "https://image.tmdb.org/t/p/w92" + item.get("logo_path"));
                        providers.add(p);
                    }
                }
            }
        }
        movie.put("watchProviders", providers);

        // Write to local cache
        cacheMovie(movie);

        return movie;
    }
}

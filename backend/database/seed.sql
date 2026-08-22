-- GlobeTrotter Seed Data

USE `globetrotter_db`;

-- Clear existing data in reverse order of dependencies
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `community_post_views`;
TRUNCATE TABLE `community_comments`;
TRUNCATE TABLE `community_post_likes`;
TRUNCATE TABLE `community_posts`;
TRUNCATE TABLE `saved_destinations`;
TRUNCATE TABLE `expenses`;
TRUNCATE TABLE `trip_budgets`;
TRUNCATE TABLE `trip_activities`;
TRUNCATE TABLE `activities`;
TRUNCATE TABLE `trip_stops`;
TRUNCATE TABLE `cities`;
TRUNCATE TABLE `trips`;
TRUNCATE TABLE `users`;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. Insert Initial Users (Password: Password123 for user, Admin123 for admin)
INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password_hash`, `phone`, `city`, `country`, `additional_info`, `profile_image`, `language`, `role`, `status`) VALUES
(1, 'Demo', 'User', 'user@example.com', '$2a$10$wK1.V/V8nL0l1N7oQ4u.1eW3xG6h.L2P8zY4n.R8T2u9V5x1y2z3a', '9876543210', 'Ahmedabad', 'India', 'Passionate explorer & adventure traveler', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80', 'en', 'user', 'active'),
(2, 'Admin', 'GlobeTrotter', 'admin@globetrotter.com', '$2a$10$wK1.V/V8nL0l1N7oQ4u.1eW3xG6h.L2P8zY4n.R8T2u9V5x1y2z3a', '9998887770', 'Mumbai', 'India', 'Platform Administrator', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80', 'en', 'admin', 'active');

-- 2. Insert Cities (16 Destinations)
INSERT INTO `cities` (`id`, `name`, `country`, `region`, `description`, `cost_index`, `popularity_score`, `image_url`, `latitude`, `longitude`) VALUES
(1, 'Goa', 'India', 'Asia', 'Sun-kissed beaches, vibrant nightlife, Portuguese heritage, and seafood havens.', 2.50, 9.80, 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80', 15.2993, 74.1240),
(2, 'Mumbai', 'India', 'Asia', 'The bustling City of Dreams, financial hub, iconic seafronts, and historic landmarks.', 3.20, 9.50, 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80', 19.0760, 72.8777),
(3, 'Jaipur', 'India', 'Asia', 'The Pink City famous for royal palaces, ancient forts, rich handicrafts, and vibrant bazaars.', 2.10, 9.20, 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80', 26.9124, 75.7873),
(4, 'Udaipur', 'India', 'Asia', 'The City of Lakes with majestic palaces, serene waters, and romantic sunsets.', 2.30, 9.10, 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80', 24.5854, 73.7125),
(5, 'Pune', 'India', 'Asia', 'Cultural capital of Maharashtra with lush green hills, historical forts, and lively cafes.', 2.00, 8.50, 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=800&q=80', 18.5204, 73.8567),
(6, 'Delhi', 'India', 'Asia', 'The historic capital blending ancient monuments, mouth-watering street food, and modern culture.', 2.40, 9.30, 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80', 28.7041, 77.1025),
(7, 'Ahmedabad', 'India', 'Asia', 'UNESCO World Heritage city with heritage havelis, textile legacy, and vibrant night markets.', 1.80, 8.40, 'https://images.unsplash.com/photo-1606298855672-3efb63017be8?auto=format&fit=crop&w=800&q=80', 23.0225, 72.5714),
(8, 'Bangalore', 'India', 'Asia', 'The Silicon Valley of India, known for pleasant weather, green parks, and craft breweries.', 2.60, 8.80, 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=800&q=80', 12.9716, 77.5946),
(9, 'Kochi', 'India', 'Asia', 'Gateway to Kerala backwaters, Chinese fishing nets, colonial Fort Kochi, and spice marts.', 2.20, 8.90, 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80', 9.9312, 76.2673),
(10, 'Hyderabad', 'India', 'Asia', 'The City of Pearls, famous for Charminar, royal Nizam heritage, and world-famous Biryani.', 2.10, 8.70, 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80', 17.3850, 78.4867),
(11, 'Paris', 'France', 'Europe', 'The City of Light, home to the Eiffel Tower, world-class art museums, fine dining, and fashion.', 4.50, 9.90, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80', 48.8566, 2.3522),
(12, 'Tokyo', 'Japan', 'Asia', 'Futuristic metropolis blending high-tech neon skyscrapers, ancient shrines, and culinary excellence.', 4.20, 9.95, 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80', 35.6762, 139.6503),
(13, 'London', 'UK', 'Europe', 'Global capital featuring royal landmarks, West End theater, Thames riverfront, and museum treasures.', 4.60, 9.85, 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80', 51.5074, -0.1278),
(14, 'Dubai', 'UAE', 'Middle East', 'Ultra-modern luxury hub with towering Burj Khalifa, desert safaris, and high-end shopping malls.', 4.30, 9.75, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80', 25.2048, 55.2708),
(15, 'Singapore', 'Asia', 'Asia', 'Garden city offering iconic Marina Bay Sands, Gardens by the Bay, and diverse multicultural street food.', 4.10, 9.70, 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=800&q=80', 1.3521, 103.8198),
(16, 'Manali', 'India', 'Asia', 'Picturesque Himalayan hill station with snow-capped peaks, river rafting, and alpine valleys.', 2.10, 9.00, 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80', 32.2432, 77.1892);

-- 3. Insert Activities Catalog (45+ activities)
INSERT INTO `activities` (`id`, `city_id`, `name`, `description`, `category`, `duration_minutes`, `estimated_cost`, `image_url`, `rating`) VALUES
(1, 1, 'Scuba Diving at Grand Island', 'Explore underwater coral reefs and marine life with certified instructors.', 'Adventure', 240, 3500.00, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', 4.80),
(2, 1, 'Sunset Cruise on Mandovi River', 'Enjoy live Goan folk music, dance performances, and sunset views.', 'Sightseeing', 90, 800.00, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', 4.60),
(3, 1, 'Fontainhas Heritage Walk', 'Stroll through Latin Quarter with Portuguese colonial colorful houses.', 'Culture', 120, 500.00, 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80', 4.70),
(4, 1, 'Water Sports at Baga Beach', 'Experience Jet Skiing, Parasailing, and Banana boat rides.', 'Adventure', 180, 2500.00, 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=600&q=80', 4.50),
(5, 1, 'Goan Seafood Tasting Tour', 'Sample fresh prawns, fish curry rice, and local feni beverages.', 'Food', 150, 1500.00, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', 4.90),
(6, 2, 'Gateway of India & Elephanta Caves Boat Tour', 'Ferry ride from Gateway of India to UNESCO-listed ancient rock-cut cave temples.', 'Sightseeing', 300, 1200.00, 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80', 4.70),
(7, 2, 'Marine Drive Sunset Stroll', 'Walk along the iconic Queens Necklace and savor Mumbai street food.', 'Sightseeing', 90, 300.00, 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80', 4.85),
(8, 2, 'Khao Galli Street Food Walk', 'Tasting Vada Pav, Pav Bhaji, Pani Puri, and Bombay Sandwich in iconic markets.', 'Food', 120, 600.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', 4.90),
(9, 2, 'Bollywood Studio Tour', 'Behind the scenes tour of film sets, dubbing studios, and live dance shows.', 'Entertainment', 180, 2500.00, 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80', 4.40),
(10, 3, 'Amer Fort & Jeep Safari', 'Explore hilltop palace complex with mirror work chambers and ramparts.', 'Sightseeing', 210, 900.00, 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80', 4.90),
(11, 3, 'Hot Air Balloon Ride over Jaipur', 'Soar over pink structures, forts, and royal gardens at sunrise.', 'Adventure', 120, 1200.00, 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=600&q=80', 4.95),
(12, 3, 'Johari Bazaar Shopping & Block Printing', 'Discover traditional silver jewelry, textiles, and block print workshops.', 'Shopping', 150, 400.00, 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=600&q=80', 4.60),
(13, 4, 'Lake Pichola Boat Ride & Jagmandir Visit', 'Scenic lake cruise past City Palace and Lake Palace at golden hour.', 'Sightseeing', 90, 700.00, 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=600&q=80', 4.88),
(14, 4, 'City Palace Royal Museum Tour', 'Explore royal museum, crystal gallery, and vintage car collection.', 'Culture', 150, 500.00, 'https://images.unsplash.com/photo-1609828913642-a5589841014b?auto=format&fit=crop&w=600&q=80', 4.80),
(15, 5, 'Shaniwar Wada Fort History Tour', 'Discover 18th-century Peshwa seat and heritage architecture.', 'Culture', 90, 200.00, 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80', 4.50),
(16, 5, 'Sinhagad Fort Trek & Pithla Bhakri Treat', 'Scenic monsoon trek with authentic local Maharashtrian cuisine at summit.', 'Adventure', 240, 600.00, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', 4.75),
(17, 6, 'Old Delhi Food & Rickshaw Ride', 'Navigate Chandni Chowk alleys for Paranthe, Jalebi, and spice market history.', 'Food', 180, 1000.00, 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80', 4.90),
(18, 6, 'Humayuns Tomb & Qutub Minar Heritage Tour', 'Explore Mughal architecture origins and worlds tallest brick minaret.', 'Sightseeing', 210, 800.00, 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=600&q=80', 4.85),
(19, 11, 'Eiffel Tower Summit & Seine River Cruise', 'Skip-the-line access to Eiffel Tower summit followed by evening champagne cruise.', 'Sightseeing', 240, 7500.00, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', 4.95),
(20, 11, 'Louvre Museum Guided Masterpiece Tour', 'See the Mona Lisa, Venus de Milo, and Winged Victory with expert art historian.', 'Culture', 180, 600.00, 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=600&q=80', 4.90),
(21, 12, 'Shibuya Crossing & Harajuku Pop Culture Walk', 'Experience worlds busiest intersection, Harajuku fashion, and cat cafes.', 'Culture', 180, 3000.00, 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80', 4.92),
(22, 12, 'Tsukiji Outer Market Sushi Making Class', 'Learn authentic sushi preparation from master chefs using fresh market ingredients.', 'Food', 150, 6500.00, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80', 4.95),
(23, 14, 'Burj Khalifa 148th Floor Observation Deck', 'Stand on top of the world at At The Top Sky with lounge refreshments.', 'Sightseeing', 120, 9000.00, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80', 4.85),
(24, 14, 'Desert Safari with Dune Bashing & BBQ Dinner', '4x4 dune bashing, camel riding, falconry, quad biking, and live belly dance dinner.', 'Adventure', 360, 5000.00, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80', 4.90);

-- 4. Saved Destinations
INSERT INTO `saved_destinations` (`user_id`, `city_id`) VALUES
(1, 1), (1, 4), (1, 11), (1, 12);

-- 5. Sample Trip
INSERT INTO `trips` (`id`, `user_id`, `name`, `description`, `start_date`, `end_date`, `cover_image`, `budget_limit`, `is_public`, `public_slug`) VALUES
(1, 1, 'Goa & Pune Coastal Getaway', 'A 6-day multi-city journey across sunny beaches of Goa and historic hill forts of Pune.', '2026-09-10', '2026-09-15', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80', 50000.00, 1, 'goa-pune-getaway-a8f31d');

-- 6. Trip Stops
INSERT INTO `trip_stops` (`id`, `trip_id`, `city_id`, `start_date`, `end_date`, `stop_order`, `notes`) VALUES
(1, 1, 1, '2026-09-10', '2026-09-12', 1, 'Relax on beaches and explore water sports'),
(2, 1, 5, '2026-09-13', '2026-09-15', 2, 'Heritage forts, trekking, and cafe exploration');

-- 7. Trip Activities
INSERT INTO `trip_activities` (`id`, `trip_stop_id`, `activity_id`, `scheduled_date`, `scheduled_time`, `activity_order`, `notes`) VALUES
(1, 1, 1, '2026-09-10', '10:00:00', 1, 'Book scuba slots in advance'),
(2, 1, 2, '2026-09-10', '17:30:00', 2, 'Mandovi river sunset cruise'),
(3, 1, 5, '2026-09-11', '13:00:00', 1, 'Enjoy authentic Goan fish thali'),
(4, 2, 15, '2026-09-13', '11:00:00', 1, 'Historical walkthrough at Shaniwar Wada'),
(5, 2, 16, '2026-09-14', '07:00:00', 1, 'Morning trek to Sinhagad Fort');

-- 8. Trip Budgets (Screen 9)
INSERT INTO `trip_budgets` (`id`, `trip_id`, `total_budget`, `currency`) VALUES
(1, 1, 50000.00, 'INR');

-- 9. Expenses (Screen 9)
INSERT INTO `expenses` (`id`, `trip_id`, `trip_stop_id`, `trip_activity_id`, `title`, `description`, `category`, `amount`, `currency`, `expense_date`) VALUES
(1, 1, 1, 1, 'Scuba Diving Fee', 'Grand island dive ticket', 'Activity', 3500.00, 'INR', '2026-09-10'),
(2, 1, 1, NULL, 'Flight to Goa', 'IndiGo flight tickets', 'Transport', 6500.00, 'INR', '2026-09-10'),
(3, 1, 1, NULL, 'Goa Beach Resort', '2 nights accommodation in Calangute', 'Accommodation', 14000.00, 'INR', '2026-09-10'),
(4, 1, 1, 3, 'Goan Fish Thali Lunch', 'Seafood dining in Panaji', 'Food', 1500.00, 'INR', '2026-09-11'),
(5, 1, 2, 5, 'Sinhagad Trek Snack', 'Pithla Bhakri at summit', 'Food', 500.00, 'INR', '2026-09-14');

-- 10. Community Posts (Screen 10)
INSERT INTO `community_posts` (`id`, `user_id`, `trip_id`, `title`, `description`, `post_type`, `visibility`, `cover_image`, `public_share_token`) VALUES
(1, 1, 1, 'Amazing Goa & Pune Adventure', 'An unforgettable 6-day journey combining Goan scuba diving and historic Sinhagad fort trekking!', 'trip', 'public', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80', 'share-goa-pune-8f92b');

-- 11. Community Post Likes (Screen 10)
INSERT INTO `community_post_likes` (`id`, `post_id`, `user_id`) VALUES
(1, 1, 2);

-- 12. Community Comments (Screen 10)
INSERT INTO `community_comments` (`id`, `post_id`, `user_id`, `content`) VALUES
(1, 1, 2, 'Great itinerary! The Scuba diving spot at Grand Island is incredible.');

-- 13. Community Views (Screen 10)
INSERT INTO `community_post_views` (`id`, `post_id`, `user_id`) VALUES
(1, 1, 2),
(2, 1, NULL);

-- GlobeTrotter Seed Data (Clean 4 Realistic Demo Users & 3 Demo Trips)

USE `globetrotter_db`;

-- Clear existing data in reverse order of foreign key dependencies
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

-- 1. Insert Initial Users (Passwords dynamically hashed by init.js: Password123 for users, Admin123 for admin)
INSERT INTO `users` (`id`, `first_name`, `last_name`, `email`, `password_hash`, `phone`, `city`, `country`, `additional_info`, `profile_image`, `language`, `role`, `status`) VALUES
(1, 'Demo', 'User', 'user@example.com', '$2a$10$wK1.V/V8nL0l1N7oQ4u.1eW3xG6h.L2P8zY4n.R8T2u9V5x1y2z3a', '+91 98765 43210', 'Ahmedabad', 'India', 'Passionate explorer & adventure traveler', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=80', 'en', 'user', 'active'),
(2, 'Admin', 'GlobeTrotter', 'admin@globetrotter.com', '$2a$10$wK1.V/V8nL0l1N7oQ4u.1eW3xG6h.L2P8zY4n.R8T2u9V5x1y2z3a', '+91 99988 87770', 'Mumbai', 'India', 'Platform Administrator', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80', 'en', 'admin', 'active'),
(3, 'Jay', 'Sohaliya', 'jay@example.com', '$2a$10$wK1.V/V8nL0l1N7oQ4u.1eW3xG6h.L2P8zY4n.R8T2u9V5x1y2z3a', '+91 98123 45678', 'Surat', 'India', 'Culture enthusiast and coastal photographer', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80', 'en', 'user', 'active'),
(4, 'Alex', 'Morgan', 'alex@example.com', '$2a$10$wK1.V/V8nL0l1N7oQ4u.1eW3xG6h.L2P8zY4n.R8T2u9V5x1y2z3a', '+1 (555) 019-2834', 'San Francisco', 'United States', 'Global Backpacker and foodie', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', 'en', 'user', 'active');

-- 2. Insert Cities Catalog (16 Destinations)
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

-- 3. Insert Activities Catalog (24 Activities)
INSERT INTO `activities` (`id`, `city_id`, `name`, `description`, `category`, `duration_minutes`, `estimated_cost`, `image_url`, `rating`) VALUES
(1, 1, 'Scuba Diving at Grand Island', 'Explore underwater coral reefs and marine life with certified instructors.', 'Adventure', 240, 3500.00, 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80', 4.80),
(2, 1, 'Sunset Cruise on Mandovi River', 'Enjoy live Goan folk music, dance performances, and sunset views.', 'Sightseeing', 90, 800.00, 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80', 4.60),
(3, 1, 'Fontainhas Heritage Walk', 'Stroll through Latin Quarter with Portuguese colonial colorful houses.', 'Culture', 120, 500.00, 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=600&q=80', 4.70),
(4, 1, 'Water Sports at Baga Beach', 'Experience Jet Skiing, Parasailing, and Banana boat rides.', 'Adventure', 180, 2500.00, 'https://images.unsplash.com/photo-1530053969600-caed2596d242?auto=format&fit=crop&w=600&q=80', 4.50),
(5, 1, 'Goan Seafood Tasting Tour', 'Sample fresh prawns, fish curry rice, and local feni beverages.', 'Food', 150, 1500.00, 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80', 4.90),
(6, 2, 'Gateway of India & Elephanta Caves Boat Tour', 'Ferry ride from Gateway of India to UNESCO rock-cut cave temples.', 'Sightseeing', 300, 1200.00, 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=600&q=80', 4.70),
(7, 2, 'Marine Drive Sunset Stroll', 'Walk along the iconic Queens Necklace and savor street food.', 'Sightseeing', 90, 300.00, 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?auto=format&fit=crop&w=600&q=80', 4.85),
(8, 2, 'Khao Galli Street Food Walk', 'Tasting Vada Pav, Pav Bhaji, and Bombay Sandwich in iconic markets.', 'Food', 120, 600.00, 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80', 4.90),
(9, 2, 'Bollywood Studio Tour', 'Behind the scenes tour of film sets, dubbing studios, and dance shows.', 'Entertainment', 180, 2500.00, 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=600&q=80', 4.40),
(10, 3, 'Amer Fort & Jeep Safari', 'Explore hilltop palace complex with mirror work chambers and ramparts.', 'Sightseeing', 210, 900.00, 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=600&q=80', 4.90),
(11, 3, 'Hot Air Balloon Ride over Jaipur', 'Soar over pink structures, forts, and royal gardens at sunrise.', 'Adventure', 120, 12000.00, 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&w=600&q=80', 4.95),
(12, 3, 'Johari Bazaar Shopping Walk', 'Discover traditional silver jewelry, textiles, and block print workshops.', 'Shopping', 150, 400.00, 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?auto=format&fit=crop&w=600&q=80', 4.60),
(13, 4, 'Lake Pichola Boat Ride & Jagmandir Visit', 'Scenic lake cruise past City Palace and Lake Palace at golden hour.', 'Sightseeing', 90, 700.00, 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=600&q=80', 4.88),
(14, 4, 'City Palace Royal Museum Tour', 'Explore royal museum, crystal gallery, and vintage car collection.', 'Culture', 150, 500.00, 'https://images.unsplash.com/photo-1609828913642-a5589841014b?auto=format&fit=crop&w=600&q=80', 4.80),
(15, 5, 'Shaniwar Wada Fort History Tour', 'Discover 18th-century Peshwa seat and heritage architecture.', 'Culture', 90, 200.00, 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?auto=format&fit=crop&w=600&q=80', 4.50),
(16, 5, 'Sinhagad Fort Trek & Pithla Bhakri Treat', 'Scenic monsoon trek with authentic local Maharashtrian cuisine at summit.', 'Adventure', 240, 600.00, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', 4.75),
(17, 6, 'Old Delhi Food & Rickshaw Ride', 'Navigate Chandni Chowk alleys for Paranthe, Jalebi, and spice market history.', 'Food', 180, 1000.00, 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80', 4.90),
(18, 6, 'Humayuns Tomb & Qutub Minar Tour', 'Explore Mughal architecture origins and tallest brick minaret.', 'Sightseeing', 210, 800.00, 'https://images.unsplash.com/photo-1585135497273-1a86b09fe70e?auto=format&fit=crop&w=600&q=80', 4.85),
(19, 11, 'Eiffel Tower Summit & Seine River Cruise', 'Skip-the-line access to Eiffel Tower summit followed by evening champagne cruise.', 'Sightseeing', 240, 7500.00, 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', 4.95),
(20, 11, 'Louvre Museum Guided Masterpiece Tour', 'See Mona Lisa and Venus de Milo with expert art historian.', 'Culture', 180, 6000.00, 'https://images.unsplash.com/photo-1565099824688-e93eb20fe622?auto=format&fit=crop&w=600&q=80', 4.90),
(21, 12, 'Shibuya Crossing & Harajuku Pop Culture', 'Experience worlds busiest intersection, Harajuku fashion, and cat cafes.', 'Culture', 180, 3000.00, 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80', 4.92),
(22, 12, 'Tsukiji Market Sushi Class', 'Learn authentic sushi preparation from master chefs using fresh ingredients.', 'Food', 150, 6500.00, 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80', 4.95),
(23, 14, 'Burj Khalifa 148th Floor Observation Deck', 'Stand on top of the world at At The Top Sky with lounge refreshments.', 'Sightseeing', 120, 9000.00, 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80', 4.85),
(24, 16, 'Solang Valley River Rafting', 'Thrilling white water rafting along Beas river rapids in Manali.', 'Adventure', 180, 2200.00, 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80', 4.85);

-- 4. Saved Destinations for Demo User
INSERT INTO `saved_destinations` (`user_id`, `city_id`) VALUES
(1, 1), (1, 4), (1, 11), (1, 12);

-- 5. Insert 3 Realistic Demo Trips for Demo User
INSERT INTO `trips` (`id`, `user_id`, `name`, `description`, `start_date`, `end_date`, `cover_image`, `budget_limit`, `is_public`, `public_slug`) VALUES
(1, 1, 'Goa Coastal Exploration', 'Active 8-day beach and heritage tour covering Sinquerim fort and spice plantations.', '2026-08-20', '2026-08-28', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80', 35000.00, 1, 'goa-coastal-exploration-a8f31d'),
(2, 1, 'Parisian Classical Capitals', 'Autumn getaway to Paris featuring Louvre museum tickets and Versailles day trip.', '2026-10-15', '2026-10-22', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1000&q=80', 85000.00, 0, 'parisian-capitals-b9c24e'),
(3, 1, 'Rajasthan Heritage Road Trip', 'Completed 8-day desert fort safari and palace hotel tour across Rajasthan.', '2026-03-12', '2026-03-20', 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1000&q=80', 42000.00, 1, 'rajasthan-heritage-c1d45f');

-- 6. Trip Stops for Demo Trips
INSERT INTO `trip_stops` (`id`, `trip_id`, `city_id`, `start_date`, `end_date`, `stop_order`, `notes`) VALUES
(1, 1, 1, '2026-08-20', '2026-08-25', 1, 'Relax on beaches and explore water sports'),
(2, 1, 5, '2026-08-26', '2026-08-28', 2, 'Heritage forts and Sinhagad trek'),
(3, 2, 11, '2026-10-15', '2026-10-22', 1, 'Eiffel tower and Louvre museum tours'),
(4, 3, 3, '2026-03-12', '2026-03-16', 1, 'Amer fort and pink city bazaars'),
(5, 3, 4, '2026-03-17', '2026-03-20', 2, 'City palace and Lake Pichola boat cruise');

-- 7. Trip Scheduled Activities
INSERT INTO `trip_activities` (`id`, `trip_stop_id`, `activity_id`, `scheduled_date`, `scheduled_time`, `activity_order`, `notes`) VALUES
(1, 1, 1, '2026-08-21', '10:00:00', 1, 'Book scuba slots in advance'),
(2, 1, 2, '2026-08-21', '17:30:00', 2, 'Mandovi river sunset cruise'),
(3, 2, 16, '2026-08-27', '07:00:00', 1, 'Morning trek to Sinhagad Fort'),
(4, 3, 19, '2026-10-16', '14:00:00', 1, 'Eiffel tower summit access'),
(5, 3, 20, '2026-10-17', '10:00:00', 1, 'Louvre guided tour'),
(6, 4, 10, '2026-03-13', '09:30:00', 1, 'Amer fort safari');

-- 8. Trip Budgets
INSERT INTO `trip_budgets` (`id`, `trip_id`, `total_budget`, `currency`) VALUES
(1, 1, 35000.00, 'INR'),
(2, 2, 85000.00, 'INR'),
(3, 3, 42000.00, 'INR');

-- 9. Expenses for Demo Trips
INSERT INTO `expenses` (`id`, `trip_id`, `trip_stop_id`, `trip_activity_id`, `title`, `description`, `category`, `amount`, `currency`, `expense_date`) VALUES
(1, 1, 1, 1, 'Scuba Diving Fee', 'Grand island dive ticket', 'Activity', 3500.00, 'INR', '2026-08-21'),
(2, 1, 1, NULL, 'Flight to Goa', 'IndiGo flight tickets', 'Transport', 6500.00, 'INR', '2026-08-20'),
(3, 1, 1, NULL, 'Goa Beach Resort', 'Resort accommodation', 'Accommodation', 14000.00, 'INR', '2026-08-20'),
(4, 2, 3, 4, 'Paris Flight & Eiffel Access', 'International travel & pass', 'Transport', 45000.00, 'INR', '2026-10-15'),
(5, 3, 4, 6, 'Amer Fort & Jaipur Palace Hotel', 'Heritage palace stays', 'Accommodation', 22000.00, 'INR', '2026-03-12');

-- 10. Community Posts
INSERT INTO `community_posts` (`id`, `user_id`, `trip_id`, `title`, `description`, `post_type`, `visibility`, `cover_image`, `public_share_token`) VALUES
(1, 1, 1, 'Amazing Goa & Pune Adventure', 'An unforgettable 8-day journey combining Goan scuba diving and historic Sinhagad fort trekking!', 'trip', 'public', 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1000&q=80', 'share-goa-pune-8f92b');

-- 11. Community Post Likes, Comments, Views
INSERT INTO `community_post_likes` (`id`, `post_id`, `user_id`) VALUES
(1, 1, 2), (2, 1, 3);

INSERT INTO `community_comments` (`id`, `post_id`, `user_id`, `content`) VALUES
(1, 1, 3, 'Great itinerary! The Scuba diving spot at Grand Island is incredible.');

INSERT INTO `community_post_views` (`id`, `post_id`, `user_id`) VALUES
(1, 1, 2), (2, 1, 3), (3, 1, 4);

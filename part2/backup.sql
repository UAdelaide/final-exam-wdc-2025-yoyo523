-- MySQL dump 10.13  Distrib 8.0.33, for Linux (x86_64)
--
-- Host: localhost    Database: DogWalkService
-- ------------------------------------------------------
-- Server version	8.0.33-0ubuntu0.22.04.2

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Dogs`
--

DROP TABLE IF EXISTS `Dogs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Dogs` (
  `dog_id` int NOT NULL AUTO_INCREMENT,
  `owner_id` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `size` enum('small','medium','large') NOT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`dog_id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `Dogs_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Dogs`
--

LOCK TABLES `Dogs` WRITE;
/*!40000 ALTER TABLE `Dogs` DISABLE KEYS */;
INSERT INTO `Dogs` VALUES (1,1,'Max','medium','https://images.dog.ceo/breeds/terrier-irish/n02093991_2663.jpg'),(2,3,'Bella','small','https://images.dog.ceo/breeds/spaniel-japanese/n02085782_382.jpg'),(3,5,'Rocky','large','https://images.dog.ceo/breeds/schnauzer-miniature/n02097047_2634.jpg'),(4,1,'Coco','small','https://images.dog.ceo/breeds/hound-blood/n02088466_743.jpg'),(5,3,'Daisy','medium','https://images.dog.ceo/breeds/labrador/n02099712_1980.jpg'),(6,9,'Buddy','small','https://images.dog.ceo/breeds/beagle/n02088364_11136.jpg'),(7,9,'Lucy','small','https://images.dog.ceo/breeds/poodle-toy/n02113624_955.jpg');
/*!40000 ALTER TABLE `Dogs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `Users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('owner','walker') NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES (1,'alice123','alice@example.com','hashed123','owner','2025-06-20 09:04:58'),(2,'bobwalker','bob@example.com','hashed456','walker','2025-06-20 09:04:58'),(3,'carol123','carol@example.com','hashed789','owner','2025-06-20 09:04:58'),(4,'danwalker','dan@example.com','hashed000','walker','2025-06-20 09:04:58'),(5,'emily123','emily@example.com','hashed111','owner','2025-06-20 09:04:58'),(9,'ownerJane','jane@example.com','hashedpassword123','owner','2025-06-06 01:32:58'),(10,'walkerMike','mike@example.com','hashedpassword456','walker','2025-06-06 01:32:58');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WalkApplications`
--

DROP TABLE IF EXISTS `WalkApplications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WalkApplications` (
  `application_id` int NOT NULL AUTO_INCREMENT,
  `request_id` int NOT NULL,
  `walker_id` int NOT NULL,
  `applied_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  PRIMARY KEY (`application_id`),
  UNIQUE KEY `unique_application` (`request_id`,`walker_id`),
  KEY `walker_id` (`walker_id`),
  CONSTRAINT `WalkApplications_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `WalkRequests` (`request_id`),
  CONSTRAINT `WalkApplications_ibfk_2` FOREIGN KEY (`walker_id`) REFERENCES `Users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WalkApplications`
--

LOCK TABLES `WalkApplications` WRITE;
/*!40000 ALTER TABLE `WalkApplications` DISABLE KEYS */;
/*!40000 ALTER TABLE `WalkApplications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WalkRatings`
--

DROP TABLE IF EXISTS `WalkRatings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WalkRatings` (
  `rating_id` int NOT NULL AUTO_INCREMENT,
  `request_id` int NOT NULL,
  `walker_id` int NOT NULL,
  `owner_id` int NOT NULL,
  `rating` int DEFAULT NULL,
  `comments` text,
  `rated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`rating_id`),
  UNIQUE KEY `unique_rating_per_walk` (`request_id`),
  KEY `walker_id` (`walker_id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `WalkRatings_ibfk_1` FOREIGN KEY (`request_id`) REFERENCES `WalkRequests` (`request_id`),
  CONSTRAINT `WalkRatings_ibfk_2` FOREIGN KEY (`walker_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `WalkRatings_ibfk_3` FOREIGN KEY (`owner_id`) REFERENCES `Users` (`user_id`),
  CONSTRAINT `WalkRatings_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WalkRatings`
--

LOCK TABLES `WalkRatings` WRITE;
/*!40000 ALTER TABLE `WalkRatings` DISABLE KEYS */;
INSERT INTO `WalkRatings` VALUES (1,1,2,1,5,'Great walk!','2025-06-20 09:43:59'),(2,2,2,1,4,'Good walker.','2025-06-20 09:43:59'),(3,3,3,1,3,'Decent performance.','2025-06-20 09:43:59');
/*!40000 ALTER TABLE `WalkRatings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `WalkRequests`
--

DROP TABLE IF EXISTS `WalkRequests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `WalkRequests` (
  `request_id` int NOT NULL AUTO_INCREMENT,
  `dog_id` int NOT NULL,
  `requested_time` datetime NOT NULL,
  `duration_minutes` int NOT NULL,
  `location` varchar(255) NOT NULL,
  `status` enum('open','accepted','completed','cancelled') DEFAULT 'open',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`request_id`),
  KEY `dog_id` (`dog_id`),
  CONSTRAINT `WalkRequests_ibfk_1` FOREIGN KEY (`dog_id`) REFERENCES `Dogs` (`dog_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `WalkRequests`
--

LOCK TABLES `WalkRequests` WRITE;
/*!40000 ALTER TABLE `WalkRequests` DISABLE KEYS */;
INSERT INTO `WalkRequests` VALUES (1,1,'2025-06-10 08:00:00',30,'Parklands','open','2025-06-20 09:08:17'),(2,2,'2025-06-10 09:30:00',45,'Beachside Ave','accepted','2025-06-20 09:08:17'),(3,3,'2025-06-11 10:00:00',60,'Central Park','open','2025-06-20 09:08:17'),(4,4,'2025-06-12 14:00:00',20,'Main Street','open','2025-06-20 09:08:17'),(5,5,'2025-06-13 15:30:00',40,'Botanic Garden','open','2025-06-20 09:08:19');
/*!40000 ALTER TABLE `WalkRequests` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-21  1:46:53

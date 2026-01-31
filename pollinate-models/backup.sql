-- MySQL dump 10.13  Distrib 8.0.40, for Win64 (x86_64)
--
-- Host: localhost    Database: models_database
-- ------------------------------------------------------
-- Server version	8.0.40

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
-- Table structure for table `admins`
--

DROP TABLE IF EXISTS `admins`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admins` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `surname` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admins`
--

LOCK TABLES `admins` WRITE;
/*!40000 ALTER TABLE `admins` DISABLE KEYS */;
INSERT INTO `admins` VALUES (1,'Yuliia','Burei','+380677160152');
/*!40000 ALTER TABLE `admins` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `already_models`
--

DROP TABLE IF EXISTS `already_models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `already_models` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `height` int NOT NULL,
  `bust` int NOT NULL,
  `waist` int NOT NULL,
  `hips` int NOT NULL,
  `shoe` int NOT NULL,
  `photo_url` text NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `already_models`
--

LOCK TABLES `already_models` WRITE;
/*!40000 ALTER TABLE `already_models` DISABLE KEYS */;
INSERT INTO `already_models` VALUES (1,'Daria','B','+380671234567',177,78,60,91,39,'\\uploads_already\\Daria_B'),(2,'Lilith','L','+380959876543',175,88,61,89,39,'\\uploads_already\\Lilith_L'),(3,'Anisia','A','+380634567890',172,75,60,88,38,'\\uploads_already\\Anisia_A'),(4,'Soni','D','+380681122334',176,79,63,89,39,'\\uploads_already\\Soni_D'),(5,'Artur','H','+380735566778',184,98,75,91,44,'\\uploads_already\\Artur_H'),(6,'Dima','T','+380993344556',187,96,76,94,45,'\\uploads_already\\Dima_T'),(7,'Borys','D','+380667788990',185,95,75,98,43,'\\uploads_already\\Borys_D'),(8,'Danyil','D','+380936677889',182,92,77,99,43,'\\uploads_already\\Danyil_D'),(9,'Vlad','Tobias','576184395',180,70,50,70,37,'\\uploads\\Vlad_Tobias');
/*!40000 ALTER TABLE `already_models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `model_applications`
--

DROP TABLE IF EXISTS `model_applications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `model_applications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `model_id` int NOT NULL,
  `session_id` int NOT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `submitted_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_model_session` (`model_id`,`session_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `model_applications`
--

LOCK TABLES `model_applications` WRITE;
/*!40000 ALTER TABLE `model_applications` DISABLE KEYS */;
INSERT INTO `model_applications` VALUES (1,5,1,'accepted','2025-05-20 07:14:38','Daria','B');
/*!40000 ALTER TABLE `model_applications` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `models`
--

DROP TABLE IF EXISTS `models`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `models` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `surname` varchar(255) NOT NULL,
  `age` int NOT NULL,
  `city` varchar(255) NOT NULL,
  `phone` varchar(50) NOT NULL,
  `height` int NOT NULL,
  `bust` int NOT NULL,
  `waist` int NOT NULL,
  `hips` int NOT NULL,
  `shoe` int NOT NULL,
  `eyes` varchar(50) NOT NULL,
  `hair` varchar(50) NOT NULL,
  `social_link` text,
  `message` text,
  `photos_path` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `models`
--

LOCK TABLES `models` WRITE;
/*!40000 ALTER TABLE `models` DISABLE KEYS */;
INSERT INTO `models` VALUES (11,'Bohdan','Yellow',21,'Kryvyi Rih','+380985146772',190,98,80,105,44,'blue','black','https://www.instagram.com/bodya_yo','','\\uploads\\Bohdan_Yellow','2025-05-20 06:47:10');
/*!40000 ALTER TABLE `models` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `photographers`
--

DROP TABLE IF EXISTS `photographers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `photographers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `surname` varchar(50) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photographers`
--

LOCK TABLES `photographers` WRITE;
/*!40000 ALTER TABLE `photographers` DISABLE KEYS */;
INSERT INTO `photographers` VALUES (1,'Vlada','Kozobrod','+380152677160');
/*!40000 ALTER TABLE `photographers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `date` datetime NOT NULL,
  `location` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES (1,'Lviv fairies','Photoshoot in the city center in fairy costumes.','2025-05-30 00:00:00','Lviv','2025-05-19 20:39:13'),(2,'In the yard with a basket of fruit ','A warm, natural-themed photoshoot set in a cozy backyard. Surrounded by greenery and soft sunlight, the model poses with a rustic fruit basket, creating a relaxed, countryside vibe that highlights freshness, simplicity, and natural beauty.','2025-06-01 00:00:00','Kryvyi Rih','2025-05-20 07:08:35');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `surname` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('model','photographer','admin') DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `phone` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Vlad','Tobias','576184395','$2b$10$uCM/cA/fIgnWXzlMpkGqUOQaGtRE1szDbC0cjFOBWeOIwjCmD9sZW','model'),(2,'Vlada','Kozobrod','+380152677160','$2b$10$ck0OuuYUauA6/xBdQm29u.Kt8dsrotWni/D5t4dvmNOikZFyr0z5O','photographer'),(3,'Yuliia','Burei','+380677160152','$2b$10$ReJabbRpJUefCYPaePKeD.keweJ4MLA6qquYbprASGfehTMPsdvpm','admin'),(4,'Artur','H','+380735566778','$2b$10$rB8Ffg7Z6h27XD4uQK4SkOsRqWVHrV07AbgTNz.V4OlNhLbEJcWsK','model'),(5,'Daria','B','+380671234567','$2b$10$pGZrFizR1fXscSmp5XXLveX2FPTSt36bnM5mZT4FsXsBdmfW57UMy','model');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-31 23:49:06

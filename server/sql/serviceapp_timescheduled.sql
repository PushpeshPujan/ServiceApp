-- MySQL dump 10.13  Distrib 8.0.21, for Win64 (x86_64)
--
-- Host: richasundrani.com    Database: serviceapp
-- ------------------------------------------------------
-- Server version	8.0.21

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `timescheduled`
--

DROP TABLE IF EXISTS `timescheduled`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `timescheduled` (
  `id` int NOT NULL,
  `userid` int NOT NULL,
  `dayid` int NOT NULL,
  `timeform` time NOT NULL DEFAULT '08:00:00',
  `timeto` time NOT NULL DEFAULT '18:00:00',
  `period` int NOT NULL DEFAULT '30'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `timescheduled`
--

LOCK TABLES `timescheduled` WRITE;
/*!40000 ALTER TABLE `timescheduled` DISABLE KEYS */;
INSERT INTO `timescheduled` VALUES (1,3,0,'16:00:00','18:00:00',30),(2,3,1,'08:00:00','18:00:00',30),(3,3,2,'08:00:00','18:00:00',30),(4,3,3,'08:00:00','18:00:00',30),(5,3,4,'08:00:00','18:00:00',30),(6,3,5,'08:00:00','18:00:00',30),(7,3,6,'08:00:00','12:00:00',30),(8,4,0,'16:00:00','18:00:00',30),(9,4,1,'08:00:00','18:00:00',30),(10,4,2,'08:00:00','18:00:00',30),(11,4,3,'08:00:00','18:00:00',30),(12,4,4,'08:00:00','18:00:00',30),(13,4,5,'08:00:00','18:00:00',30),(14,4,6,'08:00:00','12:00:00',30),(15,5,0,'16:00:00','18:00:00',30),(16,5,1,'08:00:00','18:00:00',30),(17,5,2,'08:00:00','18:00:00',30),(18,5,3,'08:00:00','18:00:00',30),(19,5,4,'08:00:00','18:00:00',30),(20,5,5,'08:00:00','18:00:00',30),(21,5,6,'08:00:00','12:00:00',30),(22,6,0,'16:00:00','18:00:00',30),(23,6,1,'08:00:00','18:00:00',30),(24,6,2,'08:00:00','18:00:00',30),(25,6,3,'08:00:00','18:00:00',30),(26,6,4,'08:00:00','18:00:00',30),(27,6,5,'08:00:00','18:00:00',30),(28,6,6,'08:00:00','12:00:00',30),(29,7,0,'16:00:00','18:00:00',30),(30,7,1,'08:00:00','18:00:00',30),(31,7,2,'08:00:00','18:00:00',30),(32,7,3,'08:00:00','18:00:00',30),(33,7,4,'08:00:00','18:00:00',30),(34,7,5,'08:00:00','18:00:00',30),(35,7,6,'08:00:00','12:00:00',30),(36,8,0,'16:00:00','18:00:00',30),(37,8,1,'08:00:00','18:00:00',30),(38,8,2,'08:00:00','18:00:00',30),(39,8,3,'08:00:00','18:00:00',30),(40,8,4,'08:00:00','18:00:00',30),(41,8,5,'08:00:00','18:00:00',30),(42,8,6,'08:00:00','12:00:00',30),(43,9,0,'16:00:00','18:00:00',30),(44,9,1,'08:00:00','18:00:00',30),(45,9,2,'08:00:00','18:00:00',30),(46,9,3,'08:00:00','18:00:00',30),(47,9,4,'08:00:00','18:00:00',30),(48,9,5,'08:00:00','18:00:00',30),(49,9,6,'08:00:00','12:00:00',30),(50,10,0,'16:00:00','18:00:00',30),(51,10,1,'08:00:00','18:00:00',30),(52,10,2,'08:00:00','18:00:00',30),(53,10,3,'08:00:00','18:00:00',30),(54,10,4,'08:00:00','18:00:00',30),(55,10,5,'08:00:00','18:00:00',30),(56,10,6,'08:00:00','12:00:00',30),(57,11,0,'16:00:00','18:00:00',30),(58,11,1,'08:00:00','18:00:00',30),(59,11,2,'08:00:00','18:00:00',30),(60,11,3,'08:00:00','18:00:00',30),(61,11,4,'08:00:00','18:00:00',30),(62,11,5,'08:00:00','18:00:00',30),(63,11,6,'08:00:00','12:00:00',30),(64,12,0,'16:00:00','18:00:00',30),(65,12,1,'08:00:00','18:00:00',30),(66,12,2,'08:00:00','18:00:00',30),(67,12,3,'08:00:00','18:00:00',30),(68,12,4,'08:00:00','18:00:00',30),(69,12,5,'08:00:00','18:00:00',30),(70,12,6,'08:00:00','12:00:00',30),(71,13,0,'16:00:00','18:00:00',30),(72,13,1,'08:00:00','18:00:00',30),(73,13,2,'08:00:00','18:00:00',30),(74,13,3,'08:00:00','18:00:00',30),(75,13,4,'08:00:00','18:00:00',30),(76,13,5,'08:00:00','18:00:00',30),(77,13,6,'08:00:00','12:00:00',30),(78,14,0,'16:00:00','18:00:00',30),(79,14,1,'08:00:00','18:00:00',30),(80,14,2,'08:00:00','18:00:00',30),(81,14,3,'08:00:00','18:00:00',30),(82,14,4,'08:00:00','18:00:00',30),(83,14,5,'08:00:00','18:00:00',30),(84,14,6,'08:00:00','12:00:00',30),(85,15,0,'16:00:00','18:00:00',30),(86,15,1,'08:00:00','18:00:00',30),(87,15,2,'08:00:00','18:00:00',30),(88,15,3,'08:00:00','18:00:00',30),(89,15,4,'08:00:00','18:00:00',30),(90,15,5,'08:00:00','18:00:00',30),(91,15,6,'08:00:00','12:00:00',30),(92,16,0,'16:00:00','18:00:00',30),(93,16,1,'08:00:00','18:00:00',30),(94,16,2,'08:00:00','18:00:00',30),(95,16,3,'08:00:00','18:00:00',30),(96,16,4,'08:00:00','18:00:00',30),(97,16,5,'08:00:00','18:00:00',30),(98,16,6,'08:00:00','12:00:00',30),(99,17,0,'16:00:00','18:00:00',30),(100,17,1,'08:00:00','18:00:00',30),(101,17,2,'08:00:00','18:00:00',30),(102,17,3,'08:00:00','18:00:00',30),(103,17,4,'08:00:00','18:00:00',30),(104,17,5,'08:00:00','18:00:00',30),(105,17,6,'08:00:00','12:00:00',30),(106,18,0,'16:00:00','18:00:00',30),(107,18,1,'08:00:00','18:00:00',30),(108,18,2,'08:00:00','18:00:00',30),(109,18,3,'08:00:00','18:00:00',30),(110,18,4,'08:00:00','18:00:00',30),(111,18,5,'08:00:00','18:00:00',30),(112,18,6,'08:00:00','12:00:00',30),(113,19,0,'16:00:00','18:00:00',30),(114,19,1,'08:00:00','18:00:00',30),(115,19,2,'08:00:00','18:00:00',30),(116,19,3,'08:00:00','18:00:00',30),(117,19,4,'08:00:00','18:00:00',30),(118,19,5,'08:00:00','18:00:00',30),(119,19,6,'08:00:00','12:00:00',30),(120,20,0,'16:00:00','18:00:00',30),(121,20,1,'08:00:00','18:00:00',30),(122,20,2,'08:00:00','18:00:00',30),(123,20,3,'08:00:00','18:00:00',30),(124,20,4,'08:00:00','18:00:00',30),(125,20,5,'08:00:00','18:00:00',30),(126,20,6,'08:00:00','12:00:00',30),(127,21,0,'16:00:00','18:00:00',30),(128,21,1,'08:00:00','18:00:00',30),(129,21,2,'08:00:00','18:00:00',30),(130,21,3,'08:00:00','18:00:00',30),(131,21,4,'08:00:00','18:00:00',30),(132,21,5,'08:00:00','18:00:00',30),(133,21,6,'08:00:00','12:00:00',30),(134,22,0,'16:00:00','18:00:00',30),(135,22,1,'08:00:00','18:00:00',30),(136,22,2,'08:00:00','18:00:00',30),(137,22,3,'08:00:00','18:00:00',30),(138,22,4,'08:00:00','18:00:00',30),(139,22,5,'08:00:00','18:00:00',30),(140,22,6,'08:00:00','12:00:00',30),(141,23,0,'16:00:00','18:00:00',30),(142,23,1,'08:00:00','18:00:00',30),(143,23,2,'08:00:00','18:00:00',30),(144,23,3,'08:00:00','18:00:00',30),(145,23,4,'08:00:00','18:00:00',30),(146,23,5,'08:00:00','18:00:00',30),(147,23,6,'08:00:00','12:00:00',30),(148,24,0,'16:00:00','18:00:00',30),(149,24,1,'08:00:00','18:00:00',30),(150,24,2,'08:00:00','18:00:00',30),(151,24,3,'08:00:00','18:00:00',30),(152,24,4,'08:00:00','18:00:00',30),(153,24,5,'08:00:00','18:00:00',30),(154,24,6,'08:00:00','12:00:00',30),(155,25,0,'16:00:00','18:00:00',30),(156,25,1,'08:00:00','18:00:00',30),(157,25,2,'08:00:00','18:00:00',30),(158,25,3,'08:00:00','18:00:00',30),(159,25,4,'08:00:00','18:00:00',30),(160,25,5,'08:00:00','18:00:00',30),(161,25,6,'08:00:00','12:00:00',30),(162,26,0,'16:00:00','18:00:00',30),(163,26,1,'08:00:00','18:00:00',30),(164,26,2,'08:00:00','18:00:00',30),(165,26,3,'08:00:00','18:00:00',30),(166,26,4,'08:00:00','18:00:00',30),(167,26,5,'08:00:00','18:00:00',30),(168,26,6,'08:00:00','12:00:00',30),(169,27,0,'16:00:00','18:00:00',30),(170,27,1,'08:00:00','18:00:00',30),(171,27,2,'08:00:00','18:00:00',30),(172,27,3,'08:00:00','18:00:00',30),(173,27,4,'08:00:00','18:00:00',30),(174,27,5,'08:00:00','18:00:00',30),(175,27,6,'08:00:00','12:00:00',30);
/*!40000 ALTER TABLE `timescheduled` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-08 20:52:09
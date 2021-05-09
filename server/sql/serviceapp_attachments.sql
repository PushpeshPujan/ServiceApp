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
-- Table structure for table `attachments`
--

DROP TABLE IF EXISTS `attachments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `attachments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `eventid` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `attachmentid` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `mimetype` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `title` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `owner` int NOT NULL,
  `isactive` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `attachments`
--

LOCK TABLES `attachments` WRITE;
/*!40000 ALTER TABLE `attachments` DISABLE KEYS */;
INSERT INTO `attachments` VALUES (4,'hullthol0it53bhr96qhdfn5b0','1g3yH8LReCGPvHrl0dDRaxeRv0d3riPBn','image/png','bitmap.png',1,1),(5,'hullthol0it53bhr96qhdfn5b0','1I5dxVOxmZUBbweYI1RJGXpw1ZwlIOoq0','image/png','bitmap.png',1,1),(6,'hullthol0it53bhr96qhdfn5b0','1D762X7U7012aN7yQsxtV_MLXU2xVf_4t','image/jpeg','0c9cf4f5-586e-4d61-a619-0d057f535c27.jpg',1,1),(7,'hullthol0it53bhr96qhdfn5b0','14a-ExsqJS_2wgkgk5U5mafGvvsND_YBK','image/png','bitmap.png',1,1),(8,'hullthol0it53bhr96qhdfn5b0','1zhhvu0zIXrJKY6HyDPT98F95de_ftkyL','image/jpeg','3134fa52-acf4-42e2-a81c-f07166542dc6.jpg',1,1),(9,'joq4l7gm9e83fev6lu7nd8iq4k','1DcIgLb-hNG2NEXZSomVw77YwU3OhBLWL','image/jpeg','e4b865fc-703f-4118-9913-785c99bba0f1.jpg',1,1),(10,'joq4l7gm9e83fev6lu7nd8iq4k','18MSbY5QUDOmcs94qXCp_RfquBCb4oVTu','image/png','bitmap.png',1,1),(11,'joq4l7gm9e83fev6lu7nd8iq4k','17cuV0HZlx8WvwCxdaq_o701mAXWytE75','image/png','bitmap.png',1,1),(12,'joq4l7gm9e83fev6lu7nd8iq4k','1Vl_3FkD3AXn2UwG7RDGGiMRDCOatyiNF','image/png','bitmap.png',1,1),(13,'joq4l7gm9e83fev6lu7nd8iq4k','1OQBqGIUITv-YucIdS8lYftavuSAbcxbd','image/jpeg','IMG_20200917_161036577_HDR.jpg',1,1),(14,'joq4l7gm9e83fev6lu7nd8iq4k','1Sj8doCAug9j96yrUyUh5GaCPnBgHdDsv','image/jpeg','IMG-20200915-WA0000.jpg',1,1),(15,'joq4l7gm9e83fev6lu7nd8iq4k','1nuAide3br46WrSxq_BRRcsn9XjLohHN4','image/jpeg','IMG_20200915_224836900_HDR.jpg',1,1),(16,'joq4l7gm9e83fev6lu7nd8iq4k','1ldeZ4UN9s1ehet9vxc4Knp4_YK3tYXqg','image/jpeg','IMG_20200917_161036577_HDR.jpg',1,1),(17,'joq4l7gm9e83fev6lu7nd8iq4k','1WPKtc8TxC8-UBFmGCUylVhbTS--nF-SO','image/jpeg','IMG_20200917_161036577_HDR.jpg',1,1),(18,'qnbs9cutnesusfv7r992a8ekbs','1EPZ9MOeb9G_w9eyZFccQ5ly9UnaPo2EJ','image/jpeg','5aba2826-c735-4a64-a7f8-82d152058161.jpg',1,1),(19,'miohvui6taupi5a2surliirlao','1Tz0cIOl08tft-cAs2zmYVu9uPdgUn_v0','image/jpeg','0f83b427-0ccd-40d2-a824-a1640146ce22.jpg',1,1),(20,'60u3l9do3161tq8lpt2mmv9mv4','1f7rSl1y1bdtX_0sPCJg_T5WAH47XrKOI','image/jpeg','6fb6e53d-d392-423f-aa06-08f5bd66aaed.jpg',1,1),(21,'60u3l9do3161tq8lpt2mmv9mv4','1D5ehBUh8F-819WlNo7DSMuDqALo2Nhx_','image/jpeg','09b3de30-b3b6-4206-8fa2-6648e30d94bf.jpg',3,1),(22,'bug30a5kilude26uvqp2tenccg','1TOrMS3s5UdBOe3_Zoc3fKt8ALmNZXRQX','image/jpeg','a8c1dd19-ba4e-4c2a-ba0a-28e624b36303.jpg',3,1),(23,'qpd0ftn1b451srmv5t2n9c3tnk','15d5pghQxf3JWoFqjuL4dFWf73xRpzOFd','image/jpeg','ec07d268-76cc-409b-a56e-2daf1d8326b4.jpg',1,1),(24,'hlv1phpbd64un2oqdog3jl5fng','1mqDTj0mlEFA0uFMQ5neMIt17LFqHCgXp','image/jpeg','e4f12967-29f7-4169-8f99-07e2a1ea76bd.jpg',1,1);
/*!40000 ALTER TABLE `attachments` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-04-08 20:52:35

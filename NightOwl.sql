-- MySQL dump 10.13  Distrib 5.7.16, for Linux (x86_64)
--
-- Host: localhost    Database: NightOwl
-- ------------------------------------------------------
-- Server version	5.7.16

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `Actors`
--

DROP TABLE IF EXISTS `Actors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Actors` (
  `name` varchar(255) NOT NULL,
  PRIMARY KEY (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Actors`
--

LOCK TABLES `Actors` WRITE;
/*!40000 ALTER TABLE `Actors` DISABLE KEYS */;
INSERT INTO `Actors` VALUES ('Brad Pitt'),('Bruce Willis'),('Denzel Washington'),('Ian Wald.'),('Jacob'),('Michael Caine');
/*!40000 ALTER TABLE `Actors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Acts`
--

DROP TABLE IF EXISTS `Acts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Acts` (
  `ActsID` int(11) NOT NULL,
  `actsName` varchar(255) NOT NULL,
  `actsMediaID` varchar(32) NOT NULL,
  PRIMARY KEY (`ActsID`),
  KEY `actsMediaID_idx` (`actsMediaID`),
  KEY `actsName_idx` (`actsName`),
  CONSTRAINT `actsMediaID` FOREIGN KEY (`actsMediaID`) REFERENCES `Movies` (`movieMediaID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `actsName` FOREIGN KEY (`actsName`) REFERENCES `Actors` (`name`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Acts`
--

LOCK TABLES `Acts` WRITE;
/*!40000 ALTER TABLE `Acts` DISABLE KEYS */;
INSERT INTO `Acts` VALUES (-1932436266,'Jacob','1481515309122.mp4'),(-1260573252,'Denzel Washington','1481506602869.mp4'),(-293819437,'Ian Wald.','1481515309122.mp4'),(2025452981,'Bruce Willis','1481506602869.mp4');
/*!40000 ALTER TABLE `Acts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Feedback`
--

DROP TABLE IF EXISTS `Feedback`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Feedback` (
  `feedbackID` int(11) NOT NULL,
  `commentUsername` varchar(20) NOT NULL,
  `commentMediaID` varchar(32) NOT NULL,
  `rating` int(11) NOT NULL,
  `comments` varchar(255) NOT NULL,
  PRIMARY KEY (`feedbackID`),
  KEY `commentUsername_idx` (`commentUsername`),
  KEY `commentMediaID_idx` (`commentMediaID`),
  CONSTRAINT `commentMediaID` FOREIGN KEY (`commentMediaID`) REFERENCES `Media` (`mediaID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `commentUsername` FOREIGN KEY (`commentUsername`) REFERENCES `Users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Feedback`
--

LOCK TABLES `Feedback` WRITE;
/*!40000 ALTER TABLE `Feedback` DISABLE KEYS */;
INSERT INTO `Feedback` VALUES (-2143062216,'Ian','1481505117246.mp4',6,'Ha Gay'),(-261545873,'Jacob','1481529358009.png',8,'Cats are cute!'),(-133188091,'Ian','1481515309122.mp4',10,'Amazing, Perfect, Flawless'),(-71156495,'Ian','1481494753394.mp3',10,'Good stuff'),(77232,'Ian','fcb570ccbd76dde9694cb0f3e651b4c9',4,'Meh'),(2427773,'Ian','1481494753394.mp3',9,'Nice'),(64538515,'Ian','1481494753394.mp3',7,'Bueno'),(65292760,'Jacob','1481515309122.mp4',9,'Cool!'),(507588952,'Ian','1481506602869.mp4',9,'Pretty Dec');
/*!40000 ALTER TABLE `Feedback` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `History`
--

DROP TABLE IF EXISTS `History`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `History` (
  `historyID` int(11) NOT NULL,
  `historyUsername` varchar(20) NOT NULL,
  `historyMediaID` varchar(32) NOT NULL,
  `accessed` datetime NOT NULL,
  PRIMARY KEY (`historyID`),
  KEY `historyMediaID_idx` (`historyMediaID`),
  KEY `historyUsername_idx` (`historyUsername`),
  CONSTRAINT `historyMediaID` FOREIGN KEY (`historyMediaID`) REFERENCES `Media` (`mediaID`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `historyUsername` FOREIGN KEY (`historyUsername`) REFERENCES `Users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `History`
--

LOCK TABLES `History` WRITE;
/*!40000 ALTER TABLE `History` DISABLE KEYS */;
INSERT INTO `History` VALUES (-2092303100,'Ian','1481529828157.mp4','2016-12-12 08:03:48'),(-2030870696,'Ian','1481493806963.mp3','2016-12-12 06:52:19'),(-1981731504,'Jacob','1481515309122.mp4','2016-12-12 14:01:29'),(-1927404718,'Ian','1481505117246.mp4','2016-12-12 08:08:30'),(-1892350773,'Ian','1481495234904.png','2016-12-12 07:42:08'),(-1892350741,'Ian','1481495234904.png','2016-12-12 07:42:19'),(-1892320895,'Ian','1481495234904.png','2016-12-12 07:43:32'),(-1869540465,'Ian','1481529370769.png','2016-12-12 07:56:10'),(-1783714495,'Jacob','1481529358009.png','2016-12-12 14:01:56'),(-1783655065,'Jacob','1481529358009.png','2016-12-12 14:03:09'),(-1783595483,'Jacob','1481529358009.png','2016-12-12 14:05:09'),(-1698220420,'Jacob','1481505117246.mp4','2016-12-12 14:00:50'),(-1698190720,'Jacob','1481505117246.mp4','2016-12-12 14:01:22'),(-1676028744,'Justin Lee','1481529370769.png','2016-12-12 14:53:46'),(-1536471385,'Ian','1481494525989.mp3','2016-12-12 06:52:13'),(-1124351548,'Ian','1481506148298.mp4','2016-12-12 06:54:08'),(-985879785,'Ian','1481529370769.png','2016-12-12 08:11:27'),(-985879783,'Ian','1481529370769.png','2016-12-12 08:11:29'),(-985879761,'Ian','1481529370769.png','2016-12-12 08:11:30'),(-985879760,'Ian','1481529370769.png','2016-12-12 08:11:31'),(-985879759,'Ian','1481529370769.png','2016-12-12 08:11:32'),(-985879758,'Ian','1481529370769.png','2016-12-12 08:11:33'),(-985879757,'Ian','1481529370769.png','2016-12-12 08:11:34'),(-985879756,'Ian','1481529370769.png','2016-12-12 08:11:35'),(-985879755,'Ian','1481529370769.png','2016-12-12 08:11:36'),(-982374249,'Ian','1481529911742.mp4','2016-12-12 08:05:11'),(-601695089,'Ian','1481529791247.mp4','2016-12-12 08:03:11'),(-349538904,'Ian','1481494247273.mp4','2016-12-12 06:46:11'),(-41887058,'Test','1481506602869.mp4','2016-12-12 15:41:30'),(-37157811,'Ian','1481506486876.mp4','2016-12-12 08:07:00'),(-37157776,'Ian','1481506486876.mp4','2016-12-12 08:07:14'),(-37127985,'Ian','1481506486876.mp4','2016-12-12 08:08:14'),(7447187,'Tyler','1481494753394.mp3','2016-12-11 23:04:07'),(7448050,'Tyler','1481494753394.mp3','2016-12-11 23:04:08'),(7449370,'Tyler','1481494753394.mp3','2016-12-11 23:04:09'),(7450241,'Tyler','1481494753394.mp3','2016-12-11 23:04:10'),(7450767,'Tyler','1481494753394.mp3','2016-12-11 23:04:10'),(7451329,'Tyler','1481494753394.mp3','2016-12-11 23:04:11'),(7452221,'Tyler','1481494753394.mp3','2016-12-11 23:04:12'),(7572189,'Tyler','1481494753394.mp3','2016-12-11 23:06:12'),(182623660,'Ian','1481495448420.mp3','2016-12-12 06:46:49'),(183427891,'Ian','1481495448420.mp3','2016-12-12 06:52:07'),(191717287,'Ian','1481495874552.mp4','2016-12-12 06:54:34'),(336573047,'Ian','1481529382984.png','2016-12-12 07:56:23'),(355725203,'Ian','fcb570ccbd76dde9694cb0f3e651b4c9','2016-12-12 06:54:16'),(374851658,'Justin Lee','fcb570ccbd76dde9694cb0f3e651b4c9','2016-12-12 14:53:49'),(538739466,'Ian','1481494247273.mp4','2016-12-12 07:51:50'),(646097818,'Ian','1481506148298.mp4','2016-12-12 08:06:14'),(805325949,'Ian','1481529867952.mp4','2016-12-12 08:04:28'),(876384290,'Jacob','1481506148298.mp4','2016-12-12 14:14:04'),(1079131625,'Ian','1481495874552.mp4','2016-12-12 07:51:43'),(1242245778,'Ian','fcb570ccbd76dde9694cb0f3e651b4c9','2016-12-12 07:42:13'),(1242275635,'Ian','fcb570ccbd76dde9694cb0f3e651b4c9','2016-12-12 07:43:37'),(1333947006,'Jacob','fcb570ccbd76dde9694cb0f3e651b4c9','2016-12-12 14:01:42'),(1337760286,'Jacob','fcb570ccbd76dde9694cb0f3e651b4c9','2016-12-12 14:45:53'),(1337822167,'Ian','1481506287189.mp4','2016-12-12 08:06:38'),(1399063327,'Ian','1481529358009.png','2016-12-12 07:55:58'),(1416671023,'Ian','1481506602869.mp4','2016-12-12 08:07:22'),(1416671083,'Ian','1481506602869.mp4','2016-12-12 08:07:40'),(1416671114,'Ian','1481506602869.mp4','2016-12-12 08:07:50'),(1416700759,'Ian','1481506602869.mp4','2016-12-12 08:08:09'),(1416700783,'Ian','1481506602869.mp4','2016-12-12 08:08:12'),(1428741088,'Jacob','1481515309122.mp4','2016-12-12 13:39:52'),(1429396366,'Jacob','1481515309122.mp4','2016-12-12 13:40:12'),(1429426132,'Jacob','1481515309122.mp4','2016-12-12 13:41:08'),(1511620418,'Ian','1481494753394.mp3','2016-12-12 03:00:20'),(1511736898,'Ian','1481494753394.mp3','2016-12-12 03:02:16'),(1511743635,'Ian','1481494753394.mp3','2016-12-12 03:02:23'),(1511754557,'Ian','1481494753394.mp3','2016-12-12 03:02:34'),(1511774008,'Ian','1481494753394.mp3','2016-12-12 03:02:54'),(1511819386,'Ian','1481494753394.mp3','2016-12-12 03:03:39'),(1511877684,'Ian','1481494753394.mp3','2016-12-12 03:04:37'),(1511892126,'Ian','1481494753394.mp3','2016-12-12 03:04:52'),(1512012140,'Ian','1481494753394.mp3','2016-12-12 03:06:52'),(1512026863,'Ian','1481494753394.mp3','2016-12-12 03:07:06'),(1512040904,'Ian','1481494753394.mp3','2016-12-12 03:07:20'),(1512081789,'Ian','1481494753394.mp3','2016-12-12 03:08:01'),(1512087632,'Ian','1481494753394.mp3','2016-12-12 03:08:07'),(1512163357,'Ian','1481494753394.mp3','2016-12-12 03:09:23'),(1512174963,'Ian','1481494753394.mp3','2016-12-12 03:09:34'),(1512294896,'Ian','1481494753394.mp3','2016-12-12 03:11:34'),(1513405402,'Ian','1481494753394.mp3','2016-12-12 03:30:05'),(1513430217,'Ian','1481494753394.mp3','2016-12-12 03:30:30'),(1513442963,'Ian','1481494753394.mp3','2016-12-12 03:30:42'),(1513446093,'Ian','1481494753394.mp3','2016-12-12 03:30:46'),(1513545424,'Ian','1481494753394.mp3','2016-12-12 03:32:25'),(1513755011,'Ian','1481494753394.mp3','2016-12-12 03:35:55'),(1513763701,'Ian','1481494753394.mp3','2016-12-12 03:36:03'),(1513883637,'Ian','1481494753394.mp3','2016-12-12 03:38:03'),(1513995528,'Ian','1481494753394.mp3','2016-12-12 03:39:55'),(1514016266,'Ian','1481494753394.mp3','2016-12-12 03:40:16'),(1514136289,'Ian','1481494753394.mp3','2016-12-12 03:42:16'),(1514399391,'Ian','1481494753394.mp3','2016-12-12 03:46:39'),(1514425708,'Ian','1481494753394.mp3','2016-12-12 03:47:05'),(1514449370,'Ian','1481494753394.mp3','2016-12-12 03:47:29'),(1514569292,'Ian','1481494753394.mp3','2016-12-12 03:49:29'),(1515140625,'Ian','1481494753394.mp3','2016-12-12 03:59:00'),(1587468788,'Ian','1481506374312.mp4','2016-12-12 08:06:49'),(1645914844,'Jacob','1481506602869.mp4','2016-12-12 14:01:25'),(1645914876,'Jacob','1481506602869.mp4','2016-12-12 14:01:36'),(1951977006,'Test','1481556978064.png','2016-12-12 15:36:18'),(2083991998,'Ian','1481515309122.mp4','2016-12-12 08:07:32'),(2084021756,'Ian','1481515309122.mp4','2016-12-12 08:08:20');
/*!40000 ALTER TABLE `History` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `HomeVideo`
--

DROP TABLE IF EXISTS `HomeVideo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `HomeVideo` (
  `homeVideoMediaID` varchar(32) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`homeVideoMediaID`),
  CONSTRAINT `homeVideoMediaID` FOREIGN KEY (`homeVideoMediaID`) REFERENCES `Videos` (`videoMediaID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `HomeVideo`
--

LOCK TABLES `HomeVideo` WRITE;
/*!40000 ALTER TABLE `HomeVideo` DISABLE KEYS */;
INSERT INTO `HomeVideo` VALUES ('1481495804158.mp4','Something'),('1481495874552.mp4','Something'),('1481495900984.mp4','Something'),('1481496189131.mp4','fdsjaflsdkjasd'),('1481529791247.mp4','Twerk it'),('1481529828157.mp4','How?'),('1481529867952.mp4','Funny'),('1481529911742.mp4','Extra stuff');
/*!40000 ALTER TABLE `HomeVideo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Media`
--

DROP TABLE IF EXISTS `Media`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Media` (
  `mediaID` varchar(32) NOT NULL,
  `name` varchar(255) NOT NULL,
  `uploadedBy` varchar(20) NOT NULL,
  PRIMARY KEY (`mediaID`),
  KEY `uploadedBy` (`uploadedBy`),
  CONSTRAINT `uploadedBy` FOREIGN KEY (`uploadedBy`) REFERENCES `Users` (`username`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Media`
--

LOCK TABLES `Media` WRITE;
/*!40000 ALTER TABLE `Media` DISABLE KEYS */;
INSERT INTO `Media` VALUES ('1481491328465.mp3','Testfjklja','Justin Lee'),('1481491413437.mp3','tkejfalkdlfk','Justin Lee'),('1481493806963.mp3','flfklkflkfjlfkjj','Justin Lee'),('1481494233496.mp4','suh','Justin Lee'),('1481494247273.mp4','suh','Justin Lee'),('1481494328852.mp3','SUH DUE','Justin Lee'),('1481494525989.mp3','SUH DUE','Justin Lee'),('1481494753394.mp3','SUH DUDE','Justin Lee'),('1481495234904.png','DICE','Tyler'),('1481495448420.mp3','Classical Music','Tyler'),('1481495804158.mp4','Educational Video','Tyler'),('1481495874552.mp4','Educational Video','Tyler'),('1481495900984.mp4','Educational Video','Tyler'),('1481496189131.mp4','Short Clip','Tyler'),('1481505117246.mp4','The Matrix','Tyler'),('1481506148298.mp4','Movie','Tyler'),('1481506287189.mp4','Movie II','Tyler'),('1481506374312.mp4','Movie III','Tyler'),('1481506486876.mp4','Movie IV','Tyler'),('1481506602869.mp4','Movie V','Tyler'),('1481515309122.mp4','Movie VI','Ian'),('1481529358009.png','cats','Ian'),('1481529370769.png','Lone wolf','Ian'),('1481529382984.png','Bird','Ian'),('1481529791247.mp4','Cats','Ian'),('1481529828157.mp4','Cats & Cucumbers','Ian'),('1481529867952.mp4','Community','Ian'),('1481529911742.mp4','More Cats','Ian'),('1481556978064.png','Phones','Test'),('fcb570ccbd76dde9694cb0f3e651b4c9','Google','Tyler');
/*!40000 ALTER TABLE `Media` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Movies`
--

DROP TABLE IF EXISTS `Movies`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Movies` (
  `movieMediaID` varchar(32) NOT NULL,
  `director` varchar(45) NOT NULL,
  `ageRating` varchar(2) NOT NULL,
  PRIMARY KEY (`movieMediaID`),
  CONSTRAINT `moviesMediaID` FOREIGN KEY (`movieMediaID`) REFERENCES `Videos` (`videoMediaID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Movies`
--

LOCK TABLES `Movies` WRITE;
/*!40000 ALTER TABLE `Movies` DISABLE KEYS */;
INSERT INTO `Movies` VALUES ('1481505117246.mp4','People','13'),('1481506148298.mp4','Director','PG'),('1481506287189.mp4','Director','R'),('1481506374312.mp4','Director','R'),('1481506486876.mp4','Another Director','R'),('1481506602869.mp4','Another Director','13'),('1481515309122.mp4','Justin','R');
/*!40000 ALTER TABLE `Movies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Music`
--

DROP TABLE IF EXISTS `Music`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Music` (
  `musicMediaID` varchar(32) NOT NULL,
  `duration` int(11) NOT NULL,
  `artist` varchar(255) NOT NULL,
  PRIMARY KEY (`musicMediaID`),
  CONSTRAINT `musicMediaID` FOREIGN KEY (`musicMediaID`) REFERENCES `Media` (`mediaID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Music`
--

LOCK TABLES `Music` WRITE;
/*!40000 ALTER TABLE `Music` DISABLE KEYS */;
INSERT INTO `Music` VALUES ('1481491328465.mp3',12,'dajfoioijasd'),('1481491413437.mp3',12,'fjdlkfjfjfsdioewjoi'),('1481493806963.mp3',12,'ewiewiewoijsdfe'),('1481494247273.mp4',12,'smallcat'),('1481494328852.mp3',12,'SmallCat'),('1481494525989.mp3',12,'SmallCat'),('1481494753394.mp3',12,'SmallKAT'),('1481495448420.mp3',328,'Beethoven');
/*!40000 ALTER TABLE `Music` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Picture`
--

DROP TABLE IF EXISTS `Picture`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Picture` (
  `pictureMediaID` varchar(32) NOT NULL,
  `description` varchar(255) NOT NULL,
  PRIMARY KEY (`pictureMediaID`),
  CONSTRAINT `pictureMediaID` FOREIGN KEY (`pictureMediaID`) REFERENCES `Media` (`mediaID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Picture`
--

LOCK TABLES `Picture` WRITE;
/*!40000 ALTER TABLE `Picture` DISABLE KEYS */;
INSERT INTO `Picture` VALUES ('1481495234904.png','Dice'),('1481529358009.png','cats'),('1481529370769.png','erino'),('1481529382984.png','Is the word'),('1481556978064.png','Description'),('fcb570ccbd76dde9694cb0f3e651b4c9','THis is google');
/*!40000 ALTER TABLE `Picture` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Users`
--

DROP TABLE IF EXISTS `Users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Users` (
  `username` varchar(20) NOT NULL,
  `password` varchar(45) NOT NULL,
  `email` varchar(255) NOT NULL,
  `country` varchar(45) NOT NULL,
  `birthdate` date NOT NULL,
  `gender` char(1) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Users`
--

LOCK TABLES `Users` WRITE;
/*!40000 ALTER TABLE `Users` DISABLE KEYS */;
INSERT INTO `Users` VALUES ('Ian','Password','isw5@case.edu','United States','1996-03-26','F'),('Jacob','Jacob','jaa134@case.edu','United States','2016-12-21','M'),('Justin Lee','password','jpl88@case.edu','USA','1996-10-28','M'),('Test','test','test@gmail.com','USA','2016-08-09','M'),('Tyler','NightOwl','trh67@case.edu','USA','1995-06-28','M');
/*!40000 ALTER TABLE `Users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Videos`
--

DROP TABLE IF EXISTS `Videos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Videos` (
  `videoMediaID` varchar(32) NOT NULL,
  `duration` int(11) NOT NULL,
  PRIMARY KEY (`videoMediaID`),
  CONSTRAINT `videoMediaID` FOREIGN KEY (`videoMediaID`) REFERENCES `Media` (`mediaID`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Videos`
--

LOCK TABLES `Videos` WRITE;
/*!40000 ALTER TABLE `Videos` DISABLE KEYS */;
INSERT INTO `Videos` VALUES ('1481495804158.mp4',150),('1481495874552.mp4',150),('1481495900984.mp4',150),('1481496189131.mp4',4),('1481505117246.mp4',35362),('1481506148298.mp4',432874),('1481506287189.mp4',32432),('1481506374312.mp4',23432),('1481506486876.mp4',32932),('1481506602869.mp4',389328),('1481515309122.mp4',99999999),('1481529791247.mp4',7),('1481529828157.mp4',30),('1481529867952.mp4',4),('1481529911742.mp4',34);
/*!40000 ALTER TABLE `Videos` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2016-12-12 11:40:02

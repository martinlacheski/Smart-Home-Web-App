-- phpMyAdmin SQL Dump
-- version 4.8.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: May 26, 2019 at 02:50 PM
-- Server version: 5.7.26-0ubuntu0.16.04.1
-- PHP Version: 7.0.33-0ubuntu0.16.04.4

CREATE DATABASE IF NOT EXISTS smart_home;

USE smart_home;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `smart_home`
--

-- --------------------------------------------------------

--
-- Table structure for table `Devices`
--

CREATE TABLE `Devices` (
  `id` int(11) NOT NULL,
  `name` varchar(64) NOT NULL,
  `description` varchar(128) NOT NULL,
  `state` decimal(10, 1) NOT NULL,
  `type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `Devices`
--

/*
Se definen los siguientes Dispositivos iniciales, 
con los tipos de dispositivos establecidos para el desarrollo de esta instancia

---Type of DEVICES---
1 = Luces ON/OFF
2 = Luces dimerizables
3 = Persianas (Apertura variable)
4 = Enchufes ON/OFF
5 = Ventiladores (Apertura variable)
6 = Aire acondicionado (temperatura variable)
*/

INSERT INTO `Devices` (`id`, `name`, `description`, `state`, `type`) VALUES
(1, 'Lampara 1', 'Luz living', 1, 1),
(2, 'Lampara 2', 'Luz cocina', 0, 1),
(3, 'Velador', 'Velador pieza', 0.5, 2),
(4, 'Persiana 1', 'Persiana living', 0.4, 3),
(5, 'Persiana 2', 'Persiana de la cocina', 0.6, 3),
(6, 'Persiana 3', 'Persiana balcon', 0.2, 3),
(7, 'Enchufe 1', 'Riego jardín', 0.0, 4),
(8, 'Ventilador 1', 'Ventilador cocina', 0.4, 5),
(9, 'Ventilador 2', 'Ventilador living', 0.0, 5),
(10, 'Ventilador 3', 'Ventilador pieza', 0.6, 5),
(11, 'AC 1', 'Aire acondicionado living', 24.0, 6),
(12, 'AC 2', 'Aire acondicionado pieza', 0.0, 6);
--
-- Indexes for dumped tables
--

--
-- Indexes for table `Devices`
--
ALTER TABLE `Devices`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Devices`
--
ALTER TABLE `Devices`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

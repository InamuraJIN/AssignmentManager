CREATE TABLE `students` (
	`id` int AUTO_INCREMENT NOT NULL,
	`username` varchar(100) NOT NULL,
	`loginId` varchar(100) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`sheetRow` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `students_id` PRIMARY KEY(`id`),
	CONSTRAINT `students_username_unique` UNIQUE(`username`),
	CONSTRAINT `students_loginId_unique` UNIQUE(`loginId`)
);

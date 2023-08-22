CREATE DATABASE  IF NOT EXISTS `perfume` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `perfume`;

DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `authAdmin`(in p_user varchar(85), in p_pass varchar(255))
BEGIN
	declare authUser int default 0;
    declare pic varchar(100) default 'error.png';
    declare rol_p INT default 0;
    
    select 
    count(*) into authUser
    from t_user 
    where username = p_user 
    and password = sha1(p_pass) 
    and rol > 2;
    
    select photo into pic from t_user where username = p_user;
    select rol into rol_p from t_user where username = p_user;
    
    if(authUser = 1) then 
		select "true" as "verified", pic as "pic", rol_p as "rol" from dual;
    else 
		select "false" as "verified" from dual;
	end if;
END ;;
DELIMITER ;
DELIMITER ;;
CREATE DEFINER=`root`@`localhost` PROCEDURE `authClient`(in p_user varchar(85), in p_pass varchar(255))
BEGIN
	declare authUser int default 0;
    
    select 
    count(*) into authUser
    from t_client 
    where email = p_user 
    and password = p_pass;

    if(authUser = 1) then 
		select "true" as "verified" from dual;
        select *
		from t_client 
		where email = p_user;
    else 
		select "false" as "verified" from dual;
	end if;
END ;;
DELIMITER ;

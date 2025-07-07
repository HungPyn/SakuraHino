package com.sakurahino.userservice.mapper;

import com.sakurahino.userservice.dto.ResponseUserDTO;
import com.sakurahino.userservice.entity.User;
import org.mapstruct.AfterMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;

@Mapper(componentModel = "spring")
public abstract class UserServiceMapper {

    @Autowired
    protected RedisTemplate<String, String> redisTemplate;

    public abstract ResponseUserDTO toResponseUserDTO(User user);

    @AfterMapping
    protected void setOnline(User user, @MappingTarget ResponseUserDTO dto) {
        boolean isOnline = Boolean.TRUE.equals(
                redisTemplate.hasKey("user:online:" + user.getId())
        );
        dto.setOnline(isOnline);
    }
}

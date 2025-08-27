package com.sakurahino.userservice.mapper;

import com.sakurahino.userservice.dto.CheckedResponseDTO;
import com.sakurahino.userservice.dto.PublicUserResponseDTO;
import com.sakurahino.userservice.dto.ResponseUserDTO;
import com.sakurahino.userservice.dto.UserLongStreakDTO;
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
    public abstract UserLongStreakDTO convertToUserLongStreakDTO(User user);
    @AfterMapping
    protected void setOnline(User user, @MappingTarget ResponseUserDTO dto) {
        boolean isOnline = Boolean.TRUE.equals(
                redisTemplate.hasKey("user:online:" + user.getId())
        );
        dto.setOnline(isOnline);
    }
    public abstract PublicUserResponseDTO toPublicUserResponseDTO(User user);

    public abstract CheckedResponseDTO toCheckedResponseDTO(User user);
}

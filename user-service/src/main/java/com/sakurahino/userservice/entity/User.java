package com.sakurahino.userservice.entity;

import com.sakurahino.clients.enums.Role;
import com.sakurahino.clients.enums.UserStatus;
import com.sakurahino.userservice.enums.UserType;
import jakarta.persistence.*;
import lombok.*;

import java.time.ZonedDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    @Column(name = "id")
    private String id;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "username")
    private String username;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "day_creation")
    private ZonedDateTime dayCreation;

    @Column(name = "updated_day")
    private ZonedDateTime updatedDay;

    @Column(name = "isNewUser")
    private  Boolean isNewUser = true;

    @Column(name = "long_steak")
    private Integer longStreak = 0;

    @Column(name = "last_date_login")
    private ZonedDateTime lastDateLogin;

    @Column(name = "exp_score")
    private Long expScore = 0L;

    @Column(name = "freeze")
    private Boolean freeze =false;

    @Column(name = "role")
    @Enumerated(EnumType.STRING)
    private Role role;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @Column(name = "user_type")
    @Enumerated(EnumType.STRING)
    private UserType userType = UserType.FREE;
}

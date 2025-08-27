package com.sakurahino.clients.feign;


import com.sakurahino.clients.config.FeignMultipartSupportConfig;
import com.sakurahino.clients.dto.InternalUserResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@FeignClient(
        name = "user-service",
        configuration = FeignMultipartSupportConfig.class
)
public interface UserServiceClients {

    @GetMapping("/internal/users/all")
    List<InternalUserResponse> getAllUsersInternal();

    @GetMapping("/internal/users/search")
    List<InternalUserResponse> searchUsers(@RequestParam String keyword);
}

package com.sakurahino.toppicservice.controller.user;

import com.sakurahino.toppicservice.dto.ToppicResponseDto;
import com.sakurahino.toppicservice.service.ToppicService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/user/toppic")
public class ToppicController {
    private final ToppicService toppicService;
    @GetMapping("/{idLevel}")
    public List<ToppicResponseDto> getToppicsByIdLevel(@PathVariable("idLevel") Integer idLevel){
        return toppicService.getToppicsByIdLevel(idLevel);
    }

    @GetMapping("/getToppic/{id}")
    public ToppicResponseDto getToppicById(@PathVariable("id") Integer id){
        return toppicService.getToppicById(id);
    }

}

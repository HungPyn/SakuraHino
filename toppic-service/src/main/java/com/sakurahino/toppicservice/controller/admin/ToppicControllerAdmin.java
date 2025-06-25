package com.sakurahino.toppicservice.controller.admin;


import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sakurahino.toppicservice.entity.dto.ToppicRequestDto;
import com.sakurahino.toppicservice.entity.dto.ToppicResponseDto;
import com.sakurahino.toppicservice.service.ToppicService;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/toppic")
public class ToppicControllerAdmin {
    private final ToppicService toppicService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping(value = "/create", consumes = {"multipart/form-data"})
    public ResponseEntity<ToppicResponseDto> createToppic(@RequestPart("toppic") String toppicStr,
                                                          @RequestPart("avatarFile") MultipartFile avatarFile
    ) {
        ToppicRequestDto toppicRequestDto;
        try {
            toppicRequestDto = objectMapper.readValue(toppicStr,ToppicRequestDto.class);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dữ liệu toppic không hợp lệ: " + e.getMessage());
        }

        if (avatarFile == null || avatarFile.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dữ liệu toppic không được để trống");
        }

      ToppicResponseDto responseDto = toppicService.createToppic(toppicRequestDto,avatarFile);

        return ResponseEntity.ok(responseDto);
    }

    @PutMapping(value = "/update", consumes = {"multipart/form-data"})
    public ResponseEntity<ToppicResponseDto> updateToppic(@RequestPart("toppic") String toppicStr,
                                                          @RequestPart("avatarFile") MultipartFile avatarFile
    ) {
        ToppicRequestDto toppicRequestDto;
        try {
            toppicRequestDto = objectMapper.readValue(toppicStr,ToppicRequestDto.class);
        } catch (JsonProcessingException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Dữ liệu toppic không hợp lệ: " + e.getMessage());
        }
        ToppicResponseDto responseDto = toppicService.updateToppic(toppicRequestDto,avatarFile);

        return ResponseEntity.ok(responseDto);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> delete(@PathVariable("id") Integer id){
        toppicService.deteteToppic(id);
        return ResponseEntity.ok("Xóa toppic thành công");
    }
}

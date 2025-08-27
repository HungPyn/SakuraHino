package com.sakurahino.JLPTservice.controller;

import com.sakurahino.JLPTservice.module.dto.BaseResponseDTO;
import com.sakurahino.JLPTservice.module.dto.request.AddNewExamRequest;
import com.sakurahino.JLPTservice.module.entity.JLPTMetaData;
import com.sakurahino.JLPTservice.service.JLPTMetaDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jlpt/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class JLPTAdminController {
    private final JLPTMetaDataService  jlptMetaDataService;
    @GetMapping
    public ResponseEntity<BaseResponseDTO<List<JLPTMetaData>>> getAll() {
        return jlptMetaDataService.getAll();
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BaseResponseDTO<JLPTMetaData>> addNew(@ModelAttribute AddNewExamRequest addNewExamRequest){
        return jlptMetaDataService.add(addNewExamRequest);
    }

    @PostMapping("/delete")
    public ResponseEntity<BaseResponseDTO<JLPTMetaData>> delete(@RequestParam Long id){
        return jlptMetaDataService.delete(id);
    }
}

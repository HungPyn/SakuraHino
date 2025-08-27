package com.sakurahino.JLPTservice.controller;

import com.sakurahino.JLPTservice.module.dto.BaseResponseDTO;
import com.sakurahino.JLPTservice.module.dto.request.UpdateResultJLPTExamRequest;
import com.sakurahino.JLPTservice.module.dto.response.GetByUserIdResponse;
import com.sakurahino.JLPTservice.module.dto.response.ResultResponse;
import com.sakurahino.JLPTservice.module.dto.response.UpdateResultJLPTExamResponse;
import com.sakurahino.JLPTservice.module.entity.JLPTMetaData;
import com.sakurahino.JLPTservice.service.JLPTMetaDataService;
import com.sakurahino.JLPTservice.service.JLPTUserStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jlpt/user")
@RequiredArgsConstructor
public class JLPTUserController {
    private final JLPTUserStatusService jlptUserStatusService;
    private final JLPTMetaDataService jlptMetaDataService;
    @GetMapping
    public ResponseEntity<BaseResponseDTO<List<GetByUserIdResponse>>> get(){
        return jlptUserStatusService.get();
    }

    @PostMapping
    public ResponseEntity<BaseResponseDTO<UpdateResultJLPTExamResponse>> updateResultJLPTExam(@RequestBody UpdateResultJLPTExamRequest updateResultJLPTExamRequest){
        return jlptUserStatusService.updateResultExam(updateResultJLPTExamRequest);
    }

    @PostMapping("/result")
    public ResponseEntity<BaseResponseDTO<UpdateResultJLPTExamResponse>> result(@RequestBody Long id){
        return jlptUserStatusService.result(id);
    }

    @PostMapping("/getForUserWeb")
    public ResponseEntity<BaseResponseDTO<JLPTMetaData>> getForUserWeb(@RequestBody Long id){
        return jlptMetaDataService.getById(id);
    }
}

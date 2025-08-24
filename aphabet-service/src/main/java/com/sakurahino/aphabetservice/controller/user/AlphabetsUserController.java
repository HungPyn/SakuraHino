package com.sakurahino.aphabetservice.controller.user;

import com.sakurahino.aphabetservice.module.dto.BaseResponeDTO;
import com.sakurahino.aphabetservice.module.dto.response.user.GetByUserResponseDTO;
import com.sakurahino.aphabetservice.module.dto.response.user.GetByUserResponseListDTO;
import com.sakurahino.aphabetservice.service.AlphabetService;
import com.sakurahino.aphabetservice.service.AlphabetsUserStatusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/alphabets/user")
@RequiredArgsConstructor
@PreAuthorize("hasRole('USER')")
public class AlphabetsUserController {
    
    @PostMapping("/new")
    public ResponseEntity<BaseResponeDTO<String>> updateResultAlphabet(@RequestBody Long alphabetId){
        return alphabetsUserStatusService.updateResult(alphabetId);
    }
    private final AlphabetsUserStatusService alphabetsUserStatusService;
    private final AlphabetService alphabetService;

    @GetMapping
    public ResponseEntity<BaseResponeDTO<GetByUserResponseListDTO>> getCharacterByUser(){
       return alphabetsUserStatusService.getAllCharacterByUserId();
    }

    @PostMapping("/old")
    public ResponseEntity<BaseResponeDTO<String>> updateResultOldAlphabet(@RequestBody Long alphabetId){
        return alphabetsUserStatusService.updateOldResult(alphabetId);
    }
}

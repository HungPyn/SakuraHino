package com.sakurahino.aphabetservice.service.impl;

import com.sakurahino.aphabetservice.module.dto.BaseResponeDTO;
import com.sakurahino.aphabetservice.module.dto.response.user.GetByUserResponseDTO;
import com.sakurahino.aphabetservice.module.entity.AlphabetsUserStatus;
import com.sakurahino.aphabetservice.module.entity.Alphabet;
import com.sakurahino.aphabetservice.repository.AlphabetRepository;
import com.sakurahino.aphabetservice.repository.AlphabetsUserStatusRepository;
import com.sakurahino.aphabetservice.service.AlphabetsUserStatusService;
import com.sakurahino.common.security.AuthHelper;
import com.sakurahino.common.util.TimeUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AlphabetUserStatusServiceImpl implements AlphabetsUserStatusService {

    private final AlphabetRepository alphabetRepository;
    private final AlphabetsUserStatusRepository alphabetsUserStatusRepository;
    private final AuthHelper authHelper;

    @Override
    public ResponseEntity<BaseResponeDTO<List<GetByUserResponseDTO>>> getAllCharacterByUserId() {
        String userId = authHelper.getUserId();
        List<GetByUserResponseDTO> responseList = new ArrayList<>();

        alphabetRepository.findRandomAlphabetsWithoutNextDualDate(Long.parseLong(userId))
                .forEach(alphabet -> responseList.add(mapToDTO(alphabet)));

        alphabetRepository.findAllDueToday(Long.parseLong(userId))
                .forEach(alphabet -> responseList.add(mapToDTO(alphabet)));

        BaseResponeDTO<List<GetByUserResponseDTO>> response = BaseResponeDTO.<List<GetByUserResponseDTO>>builder()
                .statusCode("200")
                .errorMessage("Get success")
                .Data(responseList)
                .build();

        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<BaseResponeDTO<String>> updateResult(Long alphabetId) {
        String userId = authHelper.getUserId();

        AlphabetsUserStatus status = Optional.ofNullable(
                alphabetsUserStatusRepository.findByAlphabetIdAndUserId(alphabetId, userId)
        ).orElseThrow(() -> new IllegalArgumentException("Alphabet status not found"));

        Instant completeAt = TimeUtils.nowInstant();
        status.setCompleteAt(completeAt);
        Integer current = status.getRepetiton();
        if (current == null) current =0;
        Integer next = switch (current) {
            case 0 -> 1;
            case 1 -> 3;
            case 3 -> 5;
            case 5 -> 7;
            case 7 -> 9;
            case 9 -> 11;
            case 11 -> null;
            default -> null;
        };
        status.setRepetiton(next);
        status.setNextDueDate(completeAt.plus(current == 0 ? 1 : current, ChronoUnit.DAYS));
        alphabetsUserStatusRepository.save(status);

        return ResponseEntity.ok(BaseResponeDTO.<String>builder()
                .statusCode("200")
                .errorMessage("Success")
                .Data("Success")
                .build());
    }


    private GetByUserResponseDTO mapToDTO(Alphabet alphabet) {
        return GetByUserResponseDTO.builder()
                .japaneseCharacter(alphabet.getJapaneseCharacter())
                .characterType(alphabet.getCharacterType())
                .build();
    }
}

package com.sakurahino.aphabetservice.service.impl;

import com.sakurahino.aphabetservice.enums.ProgressStatus;
import com.sakurahino.aphabetservice.module.dto.BaseResponeDTO;
import com.sakurahino.aphabetservice.module.dto.response.user.GetByUserResponseDTO;
import com.sakurahino.aphabetservice.module.dto.response.user.GetByUserResponseListDTO;
import com.sakurahino.aphabetservice.module.entity.AlphabetsUserStatus;
import com.sakurahino.aphabetservice.module.entity.Alphabet;
import com.sakurahino.aphabetservice.repository.AlphabetRepository;
import com.sakurahino.aphabetservice.repository.AlphabetsUserStatusRepository;
import com.sakurahino.aphabetservice.service.AlphabetsUserStatusService;
import com.sakurahino.common.security.AuthHelper;
import com.sakurahino.common.util.TimeUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlphabetUserStatusServiceImpl implements AlphabetsUserStatusService {

    private final AlphabetRepository alphabetRepository;
    private final AlphabetsUserStatusRepository alphabetsUserStatusRepository;
    private final AuthHelper authHelper;

    @Override
    public ResponseEntity<BaseResponeDTO<GetByUserResponseListDTO>> getAllCharacterByUserId() {
        String userId = authHelper.getUserId();

        List<GetByUserResponseDTO> newCharacters = new ArrayList<>();
        List<GetByUserResponseDTO> oldCharacters = new ArrayList<>();

        alphabetRepository.findRandomNewAlphabets(userId)
                .forEach(alphabet -> newCharacters.add(mapToDTO(alphabet)));

        alphabetRepository.findAllDueToday(userId)
                .forEach(alphabet -> oldCharacters.add(mapToDTO(alphabet)));

        GetByUserResponseListDTO dto = GetByUserResponseListDTO.builder()
                .listNewCharacter(newCharacters)
                .listOldCharacter(oldCharacters)
                .build();

        BaseResponeDTO<GetByUserResponseListDTO> response = BaseResponeDTO.<GetByUserResponseListDTO>builder()
                .statusCode("200")
                .errorMessage("Get success")
                .Data(dto)
                .build();

        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<BaseResponeDTO<String>> updateResult(Long alphabetId) {
        try {
            String userId = authHelper.getUserId();

            // Lấy alphabet
            Optional<Alphabet> alphabetOpt = alphabetRepository.findById(alphabetId);
            if (alphabetOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(BaseResponeDTO.<String>builder()
                                .statusCode("404")
                                .errorMessage("Alphabet not found with id=" + alphabetId)
                                .Data(null)
                                .build());
            }
            AlphabetsUserStatus status = alphabetsUserStatusRepository.findByAlphabetIdAndUserId(alphabetId, userId);

            ZonedDateTime completeAt = TimeUtils.nowVn();

            if (status == null) {
                status = new AlphabetsUserStatus();
                status.setAlphabet(alphabetOpt.get());
                status.setUserId(userId);
                status.setRepetiton(1);
                status.setProgressStatus(ProgressStatus.LEARNED);
                status.setCompleteAt(completeAt);
                status.setNextDueDate(completeAt.plusDays(1));
            }else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(BaseResponeDTO.<String>builder()
                                .statusCode("500")
                                .errorMessage("Alphabet Character "+status.getAlphabet().getJapaneseCharacter()+" has been completed")
                                .Data(null)
                                .build());
            }

            alphabetsUserStatusRepository.save(status);

            return ResponseEntity.ok(BaseResponeDTO.<String>builder()
                    .statusCode("200")
                    .errorMessage(null)
                    .Data("Success")
                    .build());

        } catch (Exception e) {
            log.error("Error updating alphabet result", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(BaseResponeDTO.<String>builder()
                            .statusCode("500")
                            .errorMessage(e.getMessage())
                            .Data(null)
                            .build());
        }
    }


    @Override
    public ResponseEntity<BaseResponeDTO<String>> updateOldResult(Long alphabetId) {
        String userId = authHelper.getUserId();

        AlphabetsUserStatus status = Optional.ofNullable(
                alphabetsUserStatusRepository.findByAlphabetIdAndUserId(alphabetId,userId)
        ).orElseThrow(() -> new IllegalArgumentException("Alphabet status not found"));

        ZonedDateTime completeAt = TimeUtils.nowVn();
        status.setCompleteAt(completeAt);
        status.setProgressStatus(ProgressStatus.LEARNED);

        Integer current = Optional.ofNullable(status.getRepetiton()).orElse(0);

        Integer next = switch (current) {
            case 0 -> 1;
            case 1 -> 2;
            case 2 -> 4;
            case 4 -> 7;
            case 7 -> 15;
            case 15 -> 30;
            case 30 -> null;
            default -> null;
        };

        status.setRepetiton(next);
        status.setNextDueDate(next == null ? null : completeAt.plusDays(next));

        alphabetsUserStatusRepository.save(status);

        return ResponseEntity.ok(BaseResponeDTO.<String>builder()
                .statusCode("200")
                .errorMessage("Success")
                .Data("Success")
                .build());
    }



    private GetByUserResponseDTO mapToDTO(Alphabet alphabet) {
        return GetByUserResponseDTO.builder()
                .id(alphabet.getId())
                .japaneseCharacter(alphabet.getJapaneseCharacter())
                .characterType(alphabet.getCharacterType())
                .meaning(alphabet.getMeaning())
                .audioURL(alphabet.getAudioURL())
                .build();
    }
}

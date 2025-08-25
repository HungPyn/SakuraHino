package com.sakurahino.aphabetservice.module.dto.response.user;

import lombok.Builder;
import lombok.Data;

import java.util.List;
@Data
@Builder
public class GetByUserResponseListDTO {
    List<GetByUserResponseDTO> listNewCharacter;
    List<GetByUserResponseDTO> listOldCharacter;
}

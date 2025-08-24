package com.sakurahino.aphabetservice.module.dto.response.admin;

import com.sakurahino.aphabetservice.module.entity.Alphabet;
import lombok.Data;

import java.util.List;

@Data
public class GetAllResponse {
    private List<Alphabet> alphabetList;
}

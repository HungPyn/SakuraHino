package com.sakurahino.aphabetservice.repository;

import com.sakurahino.aphabetservice.enums.CharacterType;
import com.sakurahino.aphabetservice.module.entity.Alphabet;
import feign.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlphabetRepository extends JpaRepository<Alphabet, Long> {
    public List<Alphabet> findAllByCharacterType(CharacterType characterType);
    public List<Alphabet> findAllByJapaneseCharacter(String japaneseCharacter);

    @Query(value = """
        SELECT a.* 
        FROM alphabets a
        JOIN alphabets_user_status aus 
          ON a.id = aus.alphabet_id
        WHERE aus.user_id = :userId
          AND aus.status = 'NOT_LEARNED'
        ORDER BY RAND()
        LIMIT 5
        """, nativeQuery = true)
    List<Alphabet> findRandomNewAlphabets(@Param("userId") Long userId);

    @Query(value = """
    SELECT a.* 
    FROM alphabets a
    JOIN alphabets_user_status aus 
      ON a.id = aus.alphabet_id
    WHERE aus.user_id = :userId
      AND aus.status = 'LEARNED'
      AND aus.next_dual_date IS NOT NULL
      AND DATE(aus.next_dual_date) = CURDATE()
    ORDER BY RAND()
    LIMIT 10
    """, nativeQuery = true)
    List<Alphabet> findAllDueToday(@Param("userId") Long userId);



    @Query(value = """
    SELECT a.* 
    FROM alphabets a
    JOIN alphabets_user_status aus 
      ON a.id = aus.alphabet_id
    WHERE aus.user_id = :userId
      AND DATE(aus.next_dual_date) < CURRENT_DATE
    """, nativeQuery = true)
    List<Alphabet> findAllOutDate(@Param("userId") Long userId);
}

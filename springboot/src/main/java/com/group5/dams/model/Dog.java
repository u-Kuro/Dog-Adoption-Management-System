package com.group5.dams.model;

import javax.persistence.*;
import java.time.Instant;
import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.Date;


@Entity
@Table(name="dog")
public class Dog {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;

    private String name;
    private String breed;
    private long birthTimestamp;

    public Dog() {
    }

    public Dog(long id, String name, String breed, long birthTimestamp) {
        this.id = id;
        this.name = name;
        this.breed = breed;
        this.birthTimestamp = birthTimestamp;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }

    public long getBirthTimestamp() {
        return birthTimestamp;
    }

    public void setBirthTimestamp(long birthTimestamp) {
        this.birthTimestamp = birthTimestamp;
    }

    public int getAge() {
        Instant instant = Instant.ofEpochMilli(birthTimestamp);
        LocalDate birthdate = instant.atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate currentDate = LocalDate.now();
        return Period.between(birthdate, currentDate).getYears();
    }
}

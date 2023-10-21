package com.group5.dams.controller;

import com.group5.dams.model.Dog;
import com.group5.dams.service.DogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200")

@RestController
public class DogController {
    @Autowired
    private DogService dogService;

    @RequestMapping("/api/dogs")
    public List<Dog> showDogs(){ return dogService.getDogs(); }

    @RequestMapping(value = "/api/dog/{id}")
    public Dog showDog(@PathVariable long id) throws Exception {
        return dogService.getDog(id);
    }

    @RequestMapping(value="/add-dog", method=RequestMethod.POST)
    public Dog addDog(@RequestBody Dog dog) { return dogService.addDog(dog); }

    @PutMapping(value="/update-dog/{id}")
    public ResponseEntity<Dog> updateDog(@PathVariable(value = "id") long id, @RequestBody Dog country) throws Exception {
        return dogService.updateDog(id, country);
    }

    @DeleteMapping(value="/delete-dog/{id}")
    public boolean deleteDog(@PathVariable int id) throws Exception {
        return dogService.deleteDog(id);
    }
}

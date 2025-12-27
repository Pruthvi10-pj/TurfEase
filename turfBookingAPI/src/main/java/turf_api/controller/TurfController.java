package turf_api.controller;

import org.springframework.stereotype.Controller;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import turf_api.entity.Turf;
import turf_api.exception.TurfNotFoundException;
import turf_api.service.TurfService;

@CrossOrigin
@RestController
public class TurfController {

	@Autowired
	private TurfService turfServiceRef;
	
	@GetMapping("/turfs")
	public Collection<Turf> getAllTurfs(){
		return turfServiceRef.getAllTurfs();
	}
	
	@GetMapping("/turfs/{location}")
    public List<Turf> getTurfsByLocation(@PathVariable String location) {
        return turfServiceRef.getAllTurfLoc(location);
    }
	
	@PostMapping("/turfs")
    public String createTurf(@RequestBody Turf newTurf) {
        turfServiceRef.createTurf(newTurf);
        return "Turf created successfully!";
    }
	
//	@PostMapping("/turfs")
//	public String createMultipleTurfs(@RequestBody List<Turf> turfs) {
//	    turfServiceRef.createMultipleTurfs(turfs);
//	    return "All turfs created successfully!";
//	}
	
	@PostMapping("/turfs/bulk")
    public String createMultipleTurfs(@RequestBody List<Turf> turfs) {
        turfServiceRef.createMultipleTurfs(turfs);
        return turfs.size() + " turfs created successfully!";
    }
	
	@PutMapping("/turfs/{id}")
    public String updateTurf(@PathVariable Integer id, @RequestBody Turf updatedTurf) {
        List<Turf> allTurfs = (List<Turf>) turfServiceRef.getAllTurfs();
        for (Turf existingTurf : allTurfs) {
            if (existingTurf.getId() == id) {
                // 🔹 Prevent ID change
                if (updatedTurf.getId() != 0 && updatedTurf.getId() != id) {
                    return "Turf ID cannot be changed!";
                }
                if (updatedTurf.getName() != null) {
                    existingTurf.setName(updatedTurf.getName());
                }
                if (updatedTurf.getAddress() != null) {
                    existingTurf.setAddress(updatedTurf.getAddress());
                }
                if (updatedTurf.getLocation() != null) {
                    existingTurf.setLocation(updatedTurf.getLocation());
                }
                if (updatedTurf.getPrice() != 0) {
                    existingTurf.setPrice(updatedTurf.getPrice());
                }
                if (updatedTurf.getImage() != null) {
                    existingTurf.setImage(updatedTurf.getImage());
                }
                turfServiceRef.createTurf(existingTurf);
                return "Turf updated successfully!";
            }
        }
        return "Turf not found!";
    }

    @DeleteMapping("/turfs/{id}")
    public String deleteTurf(@PathVariable Integer id) {
        turfServiceRef.deleteTurf(id);
        return "Turf deleted successfully!";
    }
 
}

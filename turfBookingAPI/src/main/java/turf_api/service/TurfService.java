package turf_api.service;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import turf_api.entity.Turf;
import turf_api.repo.TurfRepository;

@Service
public class TurfService {
	
	@Autowired
	private TurfRepository TurfRepositoryRef;
	
	public Collection<Turf> getAllTurfs() {
	    return TurfRepositoryRef.findAll();
	}

	
	public List<Turf> getAllTurfLoc(String turfLocation) {
	    return TurfRepositoryRef.findByLocation(turfLocation);
	}
	
	public void createTurf(Turf newTurf) {
		TurfRepositoryRef.save(newTurf);
	}
	
//	public void createMultipleTurfs(List<Turf> turfs) {
//		TurfRepositoryRef.saveAll(turfs);
//	}

	public void createMultipleTurfs(List<Turf> turfs) {
		 TurfRepositoryRef.saveAll(turfs); 
	}
	
	public void deleteTurf(Integer TurfId) {
		TurfRepositoryRef.deleteById(TurfId);
	}

	
}

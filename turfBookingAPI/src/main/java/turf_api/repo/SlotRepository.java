package turf_api.repo;

import turf_api.entity.Slot;
import turf_api.entity.Turf;

import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface SlotRepository extends JpaRepository<Slot, Integer> {
	  List<Slot> findByTurfAndSlotDate(Turf turf, LocalDate date);
	  void deleteByTurfAndSlotDate(Turf turf, LocalDate slotDate);

}

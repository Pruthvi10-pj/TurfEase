package turf_api.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import turf_api.entity.Slot;
import turf_api.entity.Turf;
import turf_api.repo.SlotRepository;
import turf_api.repo.TurfRepository;

@Service
public class SlotService {

    @Autowired
    private SlotRepository slotRepository;
    
    @Autowired
    private TurfRepository turfRepository;

    @Transactional
    public List<Slot> addSlots(Integer turfId, LocalDate date, List<Slot> slots) {
        Turf turf = turfRepository.findById(turfId)
            .orElseThrow(() -> new RuntimeException("Turf not found"));

        for (Slot slot : slots) {
            slot.setId(null); // Important: force JPA to treat it as new
            slot.setTurf(turf);
            slot.setSlotDate(date);
        }
        return slotRepository.saveAll(slots);
    }

    @Transactional
    public void deleteSlots(Integer turfId, LocalDate date) {
        Turf turf = turfRepository.findById(turfId)
            .orElseThrow(() -> new RuntimeException("Turf not found"));
        slotRepository.deleteByTurfAndSlotDate(turf, date);
    }

    @Transactional
    public Slot addSlot(Integer turfId, Slot slot) {
        Turf turf = turfRepository.findById(turfId)
                .orElseThrow(() -> new IllegalArgumentException("Turf not found: " + turfId));
        slot.setTurf(turf);
        return slotRepository.save(slot);
    }

    @Transactional
    public Slot updateSlot(Integer slotId, Slot updated) {
        Slot slot = slotRepository.findById(slotId)
                .orElseThrow(() -> new IllegalArgumentException("Slot not found: " + slotId));

        slot.setSlotDate(updated.getSlotDate());
        slot.setStartTime(updated.getStartTime());
        slot.setEndTime(updated.getEndTime());
        slot.setIsBooked(updated.getIsBooked());
        return slotRepository.save(slot);
    }

    @Transactional
    public void deleteSlot(Integer slotId) {
        slotRepository.deleteById(slotId);
    }

    public List<Slot> getSlotsByTurfAndDate(Integer turfId, LocalDate localDate) {
        Turf turf = turfRepository.findById(turfId)
                .orElseThrow(() -> new RuntimeException("Turf not found"));
        return slotRepository.findByTurfAndSlotDate(turf, localDate);
    }
}

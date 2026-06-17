import React, { useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { useNotificationStore } from "../state/notificationStore";
import { Log } from "../middleware/logger";

interface FilterBarProps {
  limit: number;
  onLimitChange: (limit: number) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  limit,
  onLimitChange,
}) => {
  const { state, dispatch } = useNotificationStore();
  const { selectedType } = state;

  useEffect(() => {
    void Log("frontend", "debug", "component", "FilterBar component mounted");
  }, []);

  const handleTypeChange = (event: SelectChangeEvent) => {
    const value = event.target.value as "Event" | "Result" | "Placement" | "";
    dispatch({ type: "SET_TYPE_FILTER", payload: value });
    void Log(
      "frontend",
      "info",
      "component",
      `Filter changed — notification_type set to ${value || "All"}`
    );
  };

  const handleLimitChange = (event: SelectChangeEvent) => {
    const value = Number(event.target.value);
    onLimitChange(value);
    void Log(
      "frontend",
      "info",
      "component",
      `Filter changed — limit set to ${value}`
    );
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        mb: 3,
        mt: 2,
      }}
    >
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="type-filter-label">Notification Type</InputLabel>
        <Select
          labelId="type-filter-label"
          id="type-filter-select"
          value={selectedType}
          label="Notification Type"
          onChange={handleTypeChange}
        >
          <MenuItem value="">All Types</MenuItem>
          <MenuItem value="Placement">Placement</MenuItem>
          <MenuItem value="Result">Result</MenuItem>
          <MenuItem value="Event">Event</MenuItem>
        </Select>
      </FormControl>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel id="limit-filter-label">Items Per Page</InputLabel>
        <Select
          labelId="limit-filter-label"
          id="limit-filter-select"
          value={limit.toString()}
          label="Items Per Page"
          onChange={handleLimitChange}
        >
          <MenuItem value="10">10</MenuItem>
          <MenuItem value="20">20</MenuItem>
          <MenuItem value="50">50</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
};

export default FilterBar;

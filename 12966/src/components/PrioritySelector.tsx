import React, { useEffect } from "react";
import { ToggleButton, ToggleButtonGroup, Typography, Box } from "@mui/material";
import { useNotificationStore } from "../state/notificationStore";
import { Log } from "../middleware/logger";

export const PrioritySelector: React.FC = () => {
  const { state, dispatch } = useNotificationStore();
  const { priorityN } = state;

  useEffect(() => {
    void Log(
      "frontend",
      "debug",
      "component",
      "PrioritySelector component mounted"
    );
  }, []);

  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newValue: number | null
  ) => {
    if (newValue !== null) {
      dispatch({ type: "SET_PRIORITY_N", payload: newValue });
      void Log(
        "frontend",
        "info",
        "component",
        `Priority selector changed — N set to ${newValue}`
      );
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 2 }}>
      <Typography variant="body2" sx={{ fontWeight: "medium", color: "text.secondary" }}>
        Show Top:
      </Typography>
      <ToggleButtonGroup
        value={priorityN}
        exclusive
        onChange={handleChange}
        size="small"
        color="primary"
      >
        <ToggleButton value={10}>10</ToggleButton>
        <ToggleButton value={15}>15</ToggleButton>
        <ToggleButton value={20}>20</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default PrioritySelector;

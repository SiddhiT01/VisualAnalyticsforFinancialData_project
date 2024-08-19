import { Box, Modal } from "@mui/material";
import EnchancedScatterplot from "../chart/EnchancedScatterplot";
import TrendRadioPicker from "./TrendRadioPicker";
import enhancedCSPData from "../../data/enhancedCSPData16.json";
import Timeseries from "../chart/Timeseries";
import { getFormattedTimeseriesForExtScatter } from "../../util/util";
import { useState } from "react";

const ScatterplotExp = ({ isPaused, onExperimentDataChange }) => {
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [selectedGlyphData, setSelectedGlyphData] = useState(null); // State to store selected glyph data

  const onTrendChange = (id, symbol, prediction, correct) => {
    const compositeKey = `${symbol}-${id}`;
    onExperimentDataChange({ key: compositeKey, data: { prediction, correct } });
  }

  const onChartClick = (i, id, symbol) => {
    onExperimentDataChange({ key: `${symbol}-${id}`, data: { clicked: true } });
    setOpen(true);

    const series = getFormattedTimeseriesForExtScatter(enhancedCSPData[i].data);
    setModalData({
      chartOptions: {
        series,
        showInLegend: true,
      }
    });

    setSelectedGlyphData(enhancedCSPData[i]); // Store the selected glyph data
  }

  return (
    <>
      <Box bgcolor={isPaused ? "grey" : "white"}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            p: 0,
          }}
          visibility={isPaused ? "hidden" : "visible"}
        >
          {enhancedCSPData.map((obj, i) => (
            <Box
              sx={{ p: 1, border: '1px dashed lightgrey', borderRadius: 1, margin: 0.5 }}
              key={i}
              onClick={() => onChartClick(i, obj.id, obj.name)}
            >
              <EnchancedScatterplot data={obj} i={i} id={obj.id} />
              <TrendRadioPicker onChange={(newPrediction) => onTrendChange(obj.id, obj.name, newPrediction, obj.trend)} />
            </Box>
          ))}
        </Box>

        <Modal
          open={open}
          onClose={() => setOpen(false)}
          keepMounted
        >
          <Box
            p={2}
            backgroundColor={"white"}
            sx={{
              display: 'flex',
              flexDirection: 'row', // Display in parallel (side by side)
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%', // Adjust width to accommodate both visualizations
              height: 'auto'
            }}
          >
            {/* Display Timeseries Chart */}
            <Box sx={{ flex: 1, marginRight: 2 }}>
              <Timeseries options={modalData?.chartOptions} />
            </Box>

            {/* Display Enhanced Scatterplot Glyph */}
            <Box sx={{ flex: 1, textAlign: 'center' }}>
              {selectedGlyphData && (
                <EnchancedScatterplot
                  data={selectedGlyphData}
                  i={selectedGlyphData.id}
                  id={selectedGlyphData.id}
                  width={600} // Increase width to make the glyph larger
                  height={600} // Increase height to make the glyph larger
                />
              )}
            </Box>
          </Box>
        </Modal>
      </Box>
    </>
  )
}

export default ScatterplotExp;


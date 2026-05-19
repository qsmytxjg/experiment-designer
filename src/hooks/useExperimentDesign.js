import { useMemo, useState } from 'react';
import { defaultGroups, getWellIds, plateFormats } from '../data/plateFormats.js';

const initialSamples = [
  { id: 'S001', name: 'Sample 1', groupId: 'control', replicate: '1', note: '' },
  { id: 'S002', name: 'Sample 2', groupId: 'treatment-a', replicate: '1', note: '' },
  { id: 'S003', name: 'Sample 3', groupId: 'treatment-b', replicate: '1', note: '' },
];

const initialFactors = [
  { id: 'factor-1', name: 'Treatment', levels: 'Control, Drug A, Drug B' },
  { id: 'factor-2', name: 'Timepoint', levels: '0h, 24h, 48h' },
];

export function useExperimentDesign() {
  const [experiment, setExperiment] = useState({
    title: 'Plate Experiment Design',
    organism: 'Cell line',
    objective: 'Compare treatment effects across timepoints',
    owner: 'Lab team',
  });
  const [plateFormatId, setPlateFormatId] = useState('96');
  const [activeGroupId, setActiveGroupId] = useState(defaultGroups[0].id);
  const [assignments, setAssignments] = useState({});
  const [samples, setSamples] = useState(initialSamples);
  const [factors, setFactors] = useState(initialFactors);

  const plateFormat = useMemo(
    () => plateFormats.find((format) => format.id === plateFormatId) ?? plateFormats[0],
    [plateFormatId],
  );

  const activeGroup = useMemo(
    () => defaultGroups.find((group) => group.id === activeGroupId) ?? defaultGroups[0],
    [activeGroupId],
  );

  function updateExperiment(field, value) {
    setExperiment((current) => ({ ...current, [field]: value }));
  }

  function addFactor() {
    setFactors((current) => [
      ...current,
      {
        id: `factor-${Date.now()}`,
        name: 'New factor',
        levels: 'Level 1, Level 2',
      },
    ]);
  }

  function updateFactor(id, field, value) {
    setFactors((current) =>
      current.map((factor) => (factor.id === id ? { ...factor, [field]: value } : factor)),
    );
  }

  function removeFactor(id) {
    setFactors((current) => current.filter((factor) => factor.id !== id));
  }

  function addSample() {
    setSamples((current) => {
      const nextNumber = current.length + 1;
      return [
        ...current,
        {
          id: `S${String(nextNumber).padStart(3, '0')}`,
          name: `Sample ${nextNumber}`,
          groupId: activeGroupId,
          replicate: '1',
          note: '',
        },
      ];
    });
  }

  function updateSample(id, field, value) {
    setSamples((current) =>
      current.map((sample) => (sample.id === id ? { ...sample, [field]: value } : sample)),
    );
  }

  function removeSample(id) {
    setSamples((current) => current.filter((sample) => sample.id !== id));
  }

  function assignWell(wellId) {
    setAssignments((current) => {
      if (current[wellId] === activeGroupId) {
        const next = { ...current };
        delete next[wellId];
        return next;
      }

      return { ...current, [wellId]: activeGroupId };
    });
  }

  function clearPlate() {
    setAssignments({});
  }

  const validWellIds = useMemo(() => new Set(getWellIds(plateFormat)), [plateFormat]);
  const filteredAssignments = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(assignments).filter(([wellId]) => validWellIds.has(wellId)),
      ),
    [assignments, validWellIds],
  );

  return {
    experiment,
    factors,
    samples,
    assignments: filteredAssignments,
    plateFormat,
    plateFormats,
    groups: defaultGroups,
    activeGroup,
    updateExperiment,
    addFactor,
    updateFactor,
    removeFactor,
    addSample,
    updateSample,
    removeSample,
    assignWell,
    clearPlate,
    setPlateFormatId,
    setActiveGroupId,
  };
}

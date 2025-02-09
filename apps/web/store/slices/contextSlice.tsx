import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface ContextSliceState {
  schema_version: number;
  trialId: number;
  seletedTrialGroupId: string;
  isTrialGroupAdmin: boolean;
  isFormDisabled: boolean;
}

const initialState: ContextSliceState = {
  schema_version: 1,
  trialId: 0,
  seletedTrialGroupId: '',
  isTrialGroupAdmin: false,
  isFormDisabled: false,
}

export const contextSlice = createSlice({
  name: 'context',
  initialState,
  reducers: {
    setSchemaVersion: (state, action: PayloadAction<number>) => {
      state.schema_version = action.payload
    },
    setTrialId: (state, action: PayloadAction<number>) => {
      state.trialId = action.payload
    },
    selectedTrialGroupId: (state, action: PayloadAction<string>) => {
      state.seletedTrialGroupId = action.payload
    },
    setIsTrialGroupAdmin: (state, action: PayloadAction<boolean>) => {
      state.isTrialGroupAdmin = action.payload
    },
    setIsFormDisabled: (state, action: PayloadAction<boolean>) => {
      state.isFormDisabled = action.payload
    }
  }
});

export const {
  setSchemaVersion,
  setTrialId,
  selectedTrialGroupId,
  setIsTrialGroupAdmin,
  setIsFormDisabled} = contextSlice.actions;
export default contextSlice.reducer;

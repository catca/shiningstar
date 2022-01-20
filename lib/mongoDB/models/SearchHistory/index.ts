import mongoose from 'mongoose';

export interface SearchHistoryProps {
  searcher: string;
  searched: string;
  createDate: Date;
}

const SearchHistorySchema = new mongoose.Schema<SearchHistoryProps>({
  searcher: {
    type: String,
    required: true,
    unique: false,
  },
  searched: {
    type: String,
    required: true,
    unique: false,
  },
  createDate: {
    type: Date,
    unique: false,
  },
});

export default mongoose.models.SearchHistory ||
  mongoose.model('SearchHistory', SearchHistorySchema, 'searchHistories');

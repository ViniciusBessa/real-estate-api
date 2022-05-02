import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import UserInfo from '../types/user-info';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [6, 'O nome de usuário deve ter pelo menos 6 caracteres'],
      maxlength: [20, 'O nome de usuário só pode ter até 20 caracteres'],
      required: [true, 'É necessário passar um nome de usuário'],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Uma senha deve ser especificada'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Um email deve ser especificado'],
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'announcer', 'admin'],
        message: ['{VALUE} não é um valor válido'],
      },
      default: 'user',
    },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.comparePassword = async function (comparedPassword: string) {
  const matches = await bcrypt.compare(comparedPassword, this.password);
  return matches;
};

UserSchema.methods.getUserInfo = function (): UserInfo {
  return {
    userId: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export default mongoose.model('User', UserSchema);

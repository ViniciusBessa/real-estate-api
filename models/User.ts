import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import UserInfo from '../types/user-info';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [6, 'O nome de usuário deve ter pelo menos 6 caracteres'],
      maxlength: [20, 'O nome de usuário só pode ter até 20 caracteres'],
      required: [true, 'Por favor, informe um nome de usuário'],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Por favor, informe uma senha'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Por favor, informe seu e-mail'],
      validate: {
        validator: function (value: string) {
          const emailRegex = /[a-z0-9.]+@[a-z0-9]+\.[a-z]+(.[a-z]+)?/;
          return emailRegex.test(value);
        },
        message: (prop: any) => `${prop.value} não é um e-mail válido!`,
      },
      trim: true,
      unique: true,
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'announcer', 'admin'],
        message: '{VALUE} não é um valor válido',
      },
      default: 'user',
      trim: true,
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

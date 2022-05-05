import mongoose from 'mongoose';

const PropertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Por favor, informe o título do anúncio'],
      maxlength: [100, 'O máximo de caracteres permitidos no título é 100'],
      trim: true,
    },
    description: {
      type: String,
      maxlength: [500, 'O máximo de caracteres permitidos na descrição é 500'],
      required: [true, 'Por favor, informe a descrição do anúncio'],
      trim: true,
    },
    location: {
      type: mongoose.Types.ObjectId,
      ref: 'Location',
      required: [true, 'Por favor, informe a localização do imóvel'],
    },
    announcer: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Por favor, informe o ID do anunciante'],
    },
    announceType: {
      type: String,
      enum: {
        values: ['sale', 'rent'],
        message: '{VALUE} não é um tipo de anúncio válido!',
      },
      required: [
        true,
        'Por favor, informe se o imóvel está a venda ou para alugar',
      ],
      trim: true,
    },
    petAllowed: {
      type: Boolean,
      default: true,
    },
    numberBedrooms: {
      type: Number,
      min: [1, 'O imóvel deve ter pelo menos um quarto'],
      required: [true, 'Por favor, informe quantos quartos o imóvel possui'],
    },
    numberBathrooms: {
      type: Number,
      min: [1, 'O imóvel deve ter pelo menos um banheiro'],
      required: [true, 'Por favor, informe quantos banheiros o imóvel possui'],
    },
    hasGarage: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
      minlength: [
        1,
        'Por favor, informe o URL de pelo menos uma foto do imóvel',
      ],
      maxlength: [10, 'Só são permitidas até dez fotos do imóvel'],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Property', PropertySchema);

// bot-ai.js - Искусственный интеллект для бота

class BotAI {
    constructor(difficulty = 'medium') {
        this.difficulty = difficulty;
        this.knownAttributes = {};
        this.possiblePhones = [...phones];
        this.usedAttributes = new Set();
        this.strategy = this.getStrategy();
    }
    
    getStrategy() {
        switch(this.difficulty) {
            case 'easy':
                return new EasyStrategy();
            case 'medium':
                return new MediumStrategy();
            case 'hard':
                return new HardStrategy();
            default:
                return new MediumStrategy();
        }
    }
    
    updateKnowledge(attribute, value) {
        this.knownAttributes[attribute] = value;
        this.usedAttributes.add(attribute);
        
        // Фильтруем возможные телефоны
        this.possiblePhones = this.possiblePhones.filter(
            phone => phone[attribute] === value
        );
        
        return this.possiblePhones.length;
    }
    
    chooseAttribute() {
        return this.strategy.chooseAttribute(this);
    }
    
    makeGuess() {
        return this.strategy.makeGuess(this);
    }
    
    getAnalysis() {
        return {
            possibleCount: this.possiblePhones.length,
            knownCount: Object.keys(this.knownAttributes).length,
            confidence: this.calculateConfidence()
        };
    }
    
    calculateConfidence() {
        if (this.possiblePhones.length <= 0) return 0;
        return Math.min(100, Math.round(100 / this.possiblePhones.length));
    }
}

// Стратегии бота
class EasyStrategy {
    chooseAttribute(bot) {
        const available = Object.keys(attributes).filter(a => !bot.usedAttributes.has(a));
        if (available.length === 0) return null;
        
        // Случайный выбор
        return available[Math.floor(Math.random() * available.length)];
    }
    
    makeGuess(bot) {
        if (bot.possiblePhones.length === 0) return null;
        
        // Случайный выбор из возможных
        const guessIndex = Math.floor(Math.random() * bot.possiblePhones.length);
        return bot.possiblePhones[guessIndex];
    }
}

class MediumStrategy {
    chooseAttribute(bot) {
        const available = Object.keys(attributes).filter(a => !bot.usedAttributes.has(a));
        if (available.length === 0) return null;
        
        // Предпочтение важным характеристикам
        const importantAttrs = ['processor', 'os', 'price', 'brand', 'camera'];
        const importantAvailable = available.filter(a => importantAttrs.includes(a));
        
        if (importantAvailable.length > 0 && Math.random() > 0.3) {
            return importantAvailable[Math.floor(Math.random() * importantAvailable.length)];
        }
        
        // Иначе случайный выбор
        return available[Math.floor(Math.random() * available.length)];
    }
    
    makeGuess(bot) {
        if (bot.possiblePhones.length === 0) return null;
        
        // Если осталось мало вариантов, угадываем
        if (bot.possiblePhones.length <= 3) {
            return bot.possiblePhones[Math.floor(Math.random() * bot.possiblePhones.length)];
        }
        
        // Иначе угадываем с вероятностью 30%
        if (Math.random() > 0.7) {
            return bot.possiblePhones[Math.floor(Math.random() * bot.possiblePhones.length)];
        }
        
        return null;
    }
}

class HardStrategy {
    chooseAttribute(bot) {
        const available = Object.keys(attributes).filter(a => !bot.usedAttributes.has(a));
        if (available.length === 0) return null;
        
        // Умный выбор для максимального разделения
        let bestAttr = available[0];
        let bestScore = -1;
        
        for (const attr of available) {
            // Считаем, сколько разных значений у этой характеристики среди возможных телефонов
            const values = {};
            bot.possiblePhones.forEach(phone => {
                const value = phone[attr];
                values[value] = (values[value] || 0) + 1;
            });
            
            // Оцениваем энтропию (насколько хорошо характеристика разделяет телефоны)
            let entropy = 0;
            const total = bot.possiblePhones.length;
            
            for (const count of Object.values(values)) {
                const probability = count / total;
                entropy -= probability * Math.log2(probability);
            }
            
            // Добавляем вес для важных характеристик
            const importantWeight = ['brand', 'processor', 'os'].includes(attr) ? 1.5 : 1;
            const score = entropy * importantWeight;
            
            if (score > bestScore) {
                bestScore = score;
                bestAttr = attr;
            }
        }
        
        return bestAttr;
    }
    
    makeGuess(bot) {
        if (bot.possiblePhones.length === 0) return null;
        
        // Угадываем только если уверены или если выгодно рискнуть
        const confidence = bot.calculateConfidence();
        
        if (bot.possiblePhones.length === 1) {
            // Абсолютно уверен
            return bot.possiblePhones[0];
        }
        
        if (confidence >= 50 && Math.random() > 0.5) {
            // Высокая уверенность
            return bot.possiblePhones[Math.floor(Math.random() * bot.possiblePhones.length)];
        }
        
        if (bot.possiblePhones.length <= 3 && Object.keys(bot.knownAttributes).length >= 5) {
            // Мало вариантов и много информации
            return bot.possiblePhones[Math.floor(Math.random() * bot.possiblePhones.length)];
        }
        
        return null;
    }
}

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BotAI };
}